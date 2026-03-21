const express = require('express');
const cors = require('cors');
const { generators, resolveSchema } = require('./generators');

const app = express();
const PORT = process.env.PORT || 3800;

app.use(cors());
app.use(express.json());

// ---- helpers ------------------------------------------------
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const getCount = (req, max = 100) => clamp(parseInt(req.query.count) || 1, 1, max);

// ---- routes -------------------------------------------------

// Health
app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok', version: '1.0.0', uptime: process.uptime() });
});

// Person profiles
app.get('/api/v1/person', (req, res) => {
  const count = getCount(req);
  const locale = (req.query.locale || req.query.country || 'en').toLowerCase();
  const loc = locale === 'kr' ? 'kr' : 'en';
  const data = Array.from({ length: count }, () => generators.person.generate(loc));
  res.json({ count, data });
});

// Text / Lorem ipsum
app.get('/api/v1/text', (req, res) => {
  const count = getCount(req);
  const type = (req.query.type || 'sentence').toLowerCase();
  let data;
  switch (type) {
    case 'word':
    case 'words':
      data = Array.from({ length: count }, () => generators.text.words(parseInt(req.query.wordCount) || 5));
      break;
    case 'paragraph':
    case 'paragraphs':
      data = Array.from({ length: count }, () => generators.text.paragraph());
      break;
    case 'sentence':
    case 'sentences':
    default:
      data = Array.from({ length: count }, () => generators.text.sentence());
      break;
  }
  res.json({ count, type, data });
});

// Numbers
app.get('/api/v1/number', (req, res) => {
  const count = getCount(req, 1000);
  const min = parseInt(req.query.min) || 0;
  const max = parseInt(req.query.max) || 100;
  const type = (req.query.type || 'int').toLowerCase();
  const decimals = parseInt(req.query.decimals) || 2;
  let data;
  if (type === 'float') {
    data = Array.from({ length: count }, () => generators.number.float(min, max, decimals));
  } else {
    data = Array.from({ length: count }, () => generators.number.int(min, max));
  }
  res.json({ count, min, max, type, data });
});

// UUIDs
app.get('/api/v1/uuid', (req, res) => {
  const count = getCount(req);
  const data = Array.from({ length: count }, () => generators.uuid.v4());
  res.json({ count, data });
});

// Passwords
app.get('/api/v1/password', (req, res) => {
  const count = getCount(req);
  const length = clamp(parseInt(req.query.length) || 16, 4, 128);
  const complexity = req.query.complexity || 'high';
  const data = Array.from({ length: count }, () => generators.password.generate(length, complexity));
  res.json({ count, length, complexity, data });
});

// Addresses
app.get('/api/v1/address', (req, res) => {
  const count = getCount(req);
  const country = (req.query.country || 'US').toUpperCase();
  const data = Array.from({ length: count }, () => generators.address.generate(country));
  res.json({ count, country, data });
});

// Colors
app.get('/api/v1/color', (req, res) => {
  const count = getCount(req);
  const format = (req.query.format || 'hex').toLowerCase();
  const data = Array.from({ length: count }, () => generators.color.generate(format));
  res.json({ count, format, data });
});

// Dates
app.get('/api/v1/date', (req, res) => {
  const count = getCount(req);
  const type = (req.query.type || 'past').toLowerCase();
  const years = parseInt(req.query.years) || 1;
  let data;
  if (type === 'future') {
    data = Array.from({ length: count }, () => generators.date.future(years));
  } else if (type === 'between' && req.query.from && req.query.to) {
    data = Array.from({ length: count }, () => generators.date.between(req.query.from, req.query.to));
  } else {
    data = Array.from({ length: count }, () => generators.date.past(years));
  }
  res.json({ count, type, data });
});

// Credit cards
app.get('/api/v1/creditcard', (req, res) => {
  const count = getCount(req);
  const data = Array.from({ length: count }, () => generators.creditCard.generate());
  res.json({ count, data });
});

// IP addresses
app.get('/api/v1/ip', (req, res) => {
  const count = getCount(req);
  const version = (req.query.version || 'v4').toLowerCase();
  const data = Array.from({ length: count }, () => generators.ip.generate(version));
  res.json({ count, version, data });
});

// URLs
app.get('/api/v1/url', (req, res) => {
  const count = getCount(req);
  const data = Array.from({ length: count }, () => generators.url.generate());
  res.json({ count, data });
});

// Company names
app.get('/api/v1/company', (req, res) => {
  const count = getCount(req);
  const data = Array.from({ length: count }, () => generators.company.generate());
  res.json({ count, data });
});

// Email
app.get('/api/v1/email', (req, res) => {
  const count = getCount(req);
  const data = Array.from({ length: count }, () => generators.email.generate());
  res.json({ count, data });
});

// Phone
app.get('/api/v1/phone', (req, res) => {
  const count = getCount(req);
  const country = (req.query.country || 'US').toUpperCase();
  const data = Array.from({ length: count }, () => generators.phone.generate(country));
  res.json({ count, country, data });
});

// Custom schema (POST)
app.post('/api/v1/custom', (req, res) => {
  const { schema, count: rawCount } = req.body || {};
  if (!schema || typeof schema !== 'object') {
    return res.status(400).json({ error: 'Request body must include a "schema" object.' });
  }
  const count = clamp(parseInt(rawCount) || 1, 1, 100);
  const data = Array.from({ length: count }, () => resolveSchema(schema));
  res.json({ count, data });
});

// 404
app.use((_req, res) => {
  res.status(404).json({
    error: 'Not found',
    docs: '/api/v1/health',
    endpoints: [
      'GET /api/v1/person',
      'GET /api/v1/text',
      'GET /api/v1/number',
      'GET /api/v1/uuid',
      'GET /api/v1/password',
      'GET /api/v1/address',
      'GET /api/v1/color',
      'GET /api/v1/date',
      'GET /api/v1/creditcard',
      'GET /api/v1/ip',
      'GET /api/v1/url',
      'GET /api/v1/company',
      'GET /api/v1/email',
      'GET /api/v1/phone',
      'POST /api/v1/custom',
    ],
  });
});

app.listen(PORT, () => {
  console.log(`fake-data-api running on http://localhost:${PORT}`);
  console.log(`Endpoints: http://localhost:${PORT}/api/v1/health`);
});

module.exports = app;
