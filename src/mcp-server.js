#!/usr/bin/env node
// MCP (Model Context Protocol) server for fake-data-api
// Communicates over stdin/stdout using JSON-RPC 2.0

const { generators, resolveSchema } = require('./generators');

// ---- MCP protocol helpers -----------------------------------
function jsonrpc(id, result) {
  return JSON.stringify({ jsonrpc: '2.0', id, result });
}
function jsonrpcError(id, code, message) {
  return JSON.stringify({ jsonrpc: '2.0', id, error: { code, message } });
}

// ---- Tool definitions ---------------------------------------
const TOOLS = [
  {
    name: 'generate_person',
    description: 'Generate random person profiles with name, email, phone, address, company.',
    inputSchema: {
      type: 'object',
      properties: {
        count: { type: 'number', description: 'Number of profiles (1-100)', default: 1 },
        locale: { type: 'string', enum: ['en', 'kr'], default: 'en' },
      },
    },
  },
  {
    name: 'generate_text',
    description: 'Generate lorem ipsum text: words, sentences, or paragraphs.',
    inputSchema: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['words', 'sentence', 'paragraph'], default: 'sentence' },
        count: { type: 'number', default: 1 },
      },
    },
  },
  {
    name: 'generate_number',
    description: 'Generate random integers or floats within a range.',
    inputSchema: {
      type: 'object',
      properties: {
        min: { type: 'number', default: 0 },
        max: { type: 'number', default: 100 },
        count: { type: 'number', default: 1 },
        type: { type: 'string', enum: ['int', 'float'], default: 'int' },
      },
    },
  },
  {
    name: 'generate_uuid',
    description: 'Generate UUID v4 strings.',
    inputSchema: {
      type: 'object',
      properties: {
        count: { type: 'number', default: 1 },
      },
    },
  },
  {
    name: 'generate_password',
    description: 'Generate random passwords with configurable length and complexity.',
    inputSchema: {
      type: 'object',
      properties: {
        length: { type: 'number', default: 16 },
        complexity: { type: 'string', enum: ['low', 'medium', 'high'], default: 'high' },
        count: { type: 'number', default: 1 },
      },
    },
  },
  {
    name: 'generate_address',
    description: 'Generate random addresses (US or KR format).',
    inputSchema: {
      type: 'object',
      properties: {
        country: { type: 'string', enum: ['US', 'KR'], default: 'US' },
        count: { type: 'number', default: 1 },
      },
    },
  },
  {
    name: 'generate_custom',
    description: 'Generate data from a custom schema. Schema keys map to generator paths like "person.fullName", "person.email", "number:18-65".',
    inputSchema: {
      type: 'object',
      properties: {
        schema: { type: 'object', description: 'Schema mapping field names to generator specs' },
        count: { type: 'number', default: 1 },
      },
      required: ['schema'],
    },
  },
  {
    name: 'generate_email',
    description: 'Generate random email addresses.',
    inputSchema: {
      type: 'object',
      properties: { count: { type: 'number', default: 1 } },
    },
  },
  {
    name: 'generate_date',
    description: 'Generate random dates (past, future, or between two dates).',
    inputSchema: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['past', 'future', 'between'], default: 'past' },
        years: { type: 'number', default: 1 },
        from: { type: 'string', description: 'ISO date string (for "between")' },
        to: { type: 'string', description: 'ISO date string (for "between")' },
        count: { type: 'number', default: 1 },
      },
    },
  },
  {
    name: 'generate_color',
    description: 'Generate random colors in hex, rgb, or hsl format.',
    inputSchema: {
      type: 'object',
      properties: {
        format: { type: 'string', enum: ['hex', 'rgb', 'hsl'], default: 'hex' },
        count: { type: 'number', default: 1 },
      },
    },
  },
  {
    name: 'generate_ip',
    description: 'Generate random IP addresses (v4 or v6).',
    inputSchema: {
      type: 'object',
      properties: {
        version: { type: 'string', enum: ['v4', 'v6'], default: 'v4' },
        count: { type: 'number', default: 1 },
      },
    },
  },
  {
    name: 'generate_url',
    description: 'Generate random URLs.',
    inputSchema: {
      type: 'object',
      properties: { count: { type: 'number', default: 1 } },
    },
  },
  {
    name: 'generate_creditcard',
    description: 'Generate test credit card numbers (Visa/Mastercard patterns).',
    inputSchema: {
      type: 'object',
      properties: { count: { type: 'number', default: 1 } },
    },
  },
];

// ---- Tool execution -----------------------------------------
function executeTool(name, args = {}) {
  const count = Math.max(1, Math.min(100, args.count || 1));

  switch (name) {
    case 'generate_person':
      return Array.from({ length: count }, () => generators.person.generate(args.locale || 'en'));
    case 'generate_text': {
      const type = args.type || 'sentence';
      if (type === 'words') return Array.from({ length: count }, () => generators.text.words(5));
      if (type === 'paragraph') return Array.from({ length: count }, () => generators.text.paragraph());
      return Array.from({ length: count }, () => generators.text.sentence());
    }
    case 'generate_number': {
      const min = args.min ?? 0, max = args.max ?? 100;
      if (args.type === 'float') return Array.from({ length: count }, () => generators.number.float(min, max));
      return Array.from({ length: count }, () => generators.number.int(min, max));
    }
    case 'generate_uuid':
      return Array.from({ length: count }, () => generators.uuid.v4());
    case 'generate_password':
      return Array.from({ length: count }, () => generators.password.generate(args.length || 16, args.complexity || 'high'));
    case 'generate_address':
      return Array.from({ length: count }, () => generators.address.generate(args.country || 'US'));
    case 'generate_custom':
      return Array.from({ length: count }, () => resolveSchema(args.schema));
    case 'generate_email':
      return Array.from({ length: count }, () => generators.email.generate());
    case 'generate_date': {
      const type = args.type || 'past';
      if (type === 'future') return Array.from({ length: count }, () => generators.date.future(args.years || 1));
      if (type === 'between' && args.from && args.to)
        return Array.from({ length: count }, () => generators.date.between(args.from, args.to));
      return Array.from({ length: count }, () => generators.date.past(args.years || 1));
    }
    case 'generate_color':
      return Array.from({ length: count }, () => generators.color.generate(args.format || 'hex'));
    case 'generate_ip':
      return Array.from({ length: count }, () => generators.ip.generate(args.version || 'v4'));
    case 'generate_url':
      return Array.from({ length: count }, () => generators.url.generate());
    case 'generate_creditcard':
      return Array.from({ length: count }, () => generators.creditCard.generate());
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// ---- stdin/stdout transport ---------------------------------
let buffer = '';

process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  buffer += chunk;
  let newlineIdx;
  while ((newlineIdx = buffer.indexOf('\n')) !== -1) {
    const line = buffer.slice(0, newlineIdx).trim();
    buffer = buffer.slice(newlineIdx + 1);
    if (line) handleMessage(line);
  }
});

function send(msg) {
  process.stdout.write(msg + '\n');
}

function handleMessage(raw) {
  let msg;
  try {
    msg = JSON.parse(raw);
  } catch {
    send(jsonrpcError(null, -32700, 'Parse error'));
    return;
  }

  const { id, method, params } = msg;

  switch (method) {
    case 'initialize':
      send(jsonrpc(id, {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: 'fake-data-api', version: '1.0.0' },
      }));
      break;

    case 'notifications/initialized':
      // no response needed
      break;

    case 'tools/list':
      send(jsonrpc(id, { tools: TOOLS }));
      break;

    case 'tools/call': {
      const { name, arguments: args } = params || {};
      try {
        const result = executeTool(name, args || {});
        send(jsonrpc(id, {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        }));
      } catch (err) {
        send(jsonrpc(id, {
          content: [{ type: 'text', text: `Error: ${err.message}` }],
          isError: true,
        }));
      }
      break;
    }

    default:
      send(jsonrpcError(id, -32601, `Method not found: ${method}`));
  }
}

process.stderr.write('fake-data-api MCP server started (stdio)\n');
