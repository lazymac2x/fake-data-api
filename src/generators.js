// ============================================================
// Lightweight fake data generators — zero external dependencies
// ============================================================

// ---- helpers ------------------------------------------------
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[rand(0, arr.length - 1)];
const pickN = (arr, n) => Array.from({ length: n }, () => pick(arr));

// ---- raw pools ---------------------------------------------
const FIRST_NAMES_EN = [
  'James','Mary','Robert','Patricia','John','Jennifer','Michael','Linda',
  'David','Elizabeth','William','Barbara','Richard','Susan','Joseph','Jessica',
  'Thomas','Sarah','Charles','Karen','Christopher','Lisa','Daniel','Nancy',
  'Matthew','Betty','Anthony','Margaret','Mark','Sandra','Donald','Ashley',
  'Steven','Dorothy','Paul','Kimberly','Andrew','Emily','Joshua','Donna',
  'Kenneth','Michelle','Kevin','Carol','Brian','Amanda','George','Melissa',
  'Timothy','Deborah','Ronald','Stephanie','Edward','Rebecca','Jason','Sharon',
  'Jeffrey','Laura','Ryan','Cynthia','Jacob','Kathleen','Gary','Amy',
  'Nicholas','Angela','Eric','Shirley','Jonathan','Anna','Stephen','Brenda',
];

const LAST_NAMES_EN = [
  'Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis',
  'Rodriguez','Martinez','Hernandez','Lopez','Gonzalez','Wilson','Anderson',
  'Thomas','Taylor','Moore','Jackson','Martin','Lee','Perez','Thompson',
  'White','Harris','Sanchez','Clark','Ramirez','Lewis','Robinson','Walker',
  'Young','Allen','King','Wright','Scott','Torres','Nguyen','Hill',
  'Flores','Green','Adams','Nelson','Baker','Hall','Rivera','Campbell',
  'Mitchell','Carter','Roberts','Gomez','Phillips','Evans','Turner','Diaz',
];

const FIRST_NAMES_KR = [
  '민준','서준','도윤','예준','시우','하준','주원','지호',
  '지후','준서','준우','현우','도현','지훈','건우','우진',
  '선우','서진','민재','현준','연우','유준','정우','승현',
  '서윤','서연','지우','서현','민서','하은','하윤','윤서',
  '지민','채원','수아','지아','지윤','은서','다은','예은',
  '수빈','지현','예진','소연','채연','유진','민지','수진',
];

const LAST_NAMES_KR = [
  '김','이','박','최','정','강','조','윤','장','임',
  '한','오','서','신','권','황','안','송','류','전',
  '홍','고','문','양','손','배','백','허','유','남',
];

const DOMAINS = [
  'gmail.com','yahoo.com','outlook.com','hotmail.com','protonmail.com',
  'icloud.com','mail.com','fastmail.com','zoho.com','aol.com',
  'naver.com','daum.net','kakao.com',
];

const STREET_SUFFIXES = ['St','Ave','Blvd','Dr','Ln','Ct','Pl','Way','Rd','Cir'];
const CITIES_US = [
  'New York','Los Angeles','Chicago','Houston','Phoenix','Philadelphia',
  'San Antonio','San Diego','Dallas','San Jose','Austin','Jacksonville',
  'Fort Worth','Columbus','Charlotte','Indianapolis','San Francisco',
  'Seattle','Denver','Nashville','Portland','Memphis','Louisville',
];
const STATES_US = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN',
  'IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV',
  'NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN',
  'TX','UT','VT','VA','WA','WV','WI','WY',
];
const CITIES_KR = [
  '서울','부산','인천','대구','대전','광주','울산','수원',
  '성남','고양','용인','창원','화성','청주','전주','천안',
  '남양주','김포','광명','시흥','파주','의정부','김해','제주',
];
const DISTRICTS_KR = [
  '강남구','서초구','송파구','마포구','용산구','종로구','중구',
  '영등포구','성동구','광진구','동대문구','중랑구','강북구',
  '도봉구','노원구','은평구','서대문구','강서구','양천구',
  '구로구','금천구','동작구','관악구','강동구',
];

const COMPANY_PREFIXES = [
  'Global','Pacific','Apex','Nova','Prime','Summit','Core','Vortex',
  'Nexus','Pinnacle','Quantum','Vertex','Zenith','Atlas','Pulse',
  'Fusion','Orbit','Stellar','Echo','Spark','Swift','Blue','Iron',
];
const COMPANY_SUFFIXES = [
  'Tech','Systems','Solutions','Labs','Digital','Software','AI',
  'Cloud','Data','Networks','Industries','Group','Corp','Inc',
  'Dynamics','Innovations','Ventures','Analytics','Robotics',
];

const LOREM_WORDS = [
  'lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit',
  'sed','do','eiusmod','tempor','incididunt','ut','labore','et','dolore',
  'magna','aliqua','enim','ad','minim','veniam','quis','nostrud',
  'exercitation','ullamco','laboris','nisi','aliquip','ex','ea','commodo',
  'consequat','duis','aute','irure','in','reprehenderit','voluptate',
  'velit','esse','cillum','fugiat','nulla','pariatur','excepteur','sint',
  'occaecat','cupidatat','non','proident','sunt','culpa','qui','officia',
  'deserunt','mollit','anim','id','est','laborum','at','vero','eos',
  'accusamus','iusto','odio','dignissimos','ducimus','blanditiis',
  'praesentium','voluptatum','deleniti','atque','corrupti','quos',
  'dolores','quas','molestias','recusandae','itaque','earum','rerum',
  'hic','tenetur','sapiente','delectus','aut','reiciendis','voluptatibus',
  'maiores','alias','perferendis','doloribus','asperiores','repellat',
];

// ---- generators --------------------------------------------

const generators = {
  // -- Names --
  name: {
    firstName(locale = 'en') {
      return locale === 'kr' ? pick(FIRST_NAMES_KR) : pick(FIRST_NAMES_EN);
    },
    lastName(locale = 'en') {
      return locale === 'kr' ? pick(LAST_NAMES_KR) : pick(LAST_NAMES_EN);
    },
    fullName(locale = 'en') {
      if (locale === 'kr') {
        return `${this.lastName('kr')}${this.firstName('kr')}`;
      }
      return `${this.firstName('en')} ${this.lastName('en')}`;
    },
  },

  // -- Email --
  email: {
    generate(name) {
      const first = (name || pick(FIRST_NAMES_EN)).toLowerCase().replace(/\s+/g, '');
      const num = rand(1, 999);
      return `${first}${num}@${pick(DOMAINS)}`;
    },
  },

  // -- Phone --
  phone: {
    us() {
      const area = rand(200, 999);
      const mid = rand(200, 999);
      const last = rand(1000, 9999);
      return `+1-${area}-${mid}-${last}`;
    },
    kr() {
      const mid = rand(1000, 9999);
      const last = rand(1000, 9999);
      return `010-${mid}-${last}`;
    },
    generate(country = 'US') {
      return country.toUpperCase() === 'KR' ? this.kr() : this.us();
    },
  },

  // -- Address --
  address: {
    us() {
      return {
        street: `${rand(1, 9999)} ${pick(LAST_NAMES_EN)} ${pick(STREET_SUFFIXES)}`,
        city: pick(CITIES_US),
        state: pick(STATES_US),
        zip: String(rand(10000, 99999)),
        country: 'US',
      };
    },
    kr() {
      return {
        street: `${pick(DISTRICTS_KR)} ${rand(1, 500)}번길 ${rand(1, 99)}`,
        city: pick(CITIES_KR),
        state: '',
        zip: String(rand(10000, 99999)),
        country: 'KR',
      };
    },
    generate(country = 'US') {
      return country.toUpperCase() === 'KR' ? this.kr() : this.us();
    },
  },

  // -- Company --
  company: {
    generate() {
      return `${pick(COMPANY_PREFIXES)} ${pick(COMPANY_SUFFIXES)}`;
    },
  },

  // -- Lorem Ipsum --
  text: {
    words(count = 10) {
      return pickN(LOREM_WORDS, count).join(' ');
    },
    sentence(wordCount) {
      const n = wordCount || rand(6, 14);
      const w = this.words(n);
      return w.charAt(0).toUpperCase() + w.slice(1) + '.';
    },
    sentences(count = 3) {
      return Array.from({ length: count }, () => this.sentence()).join(' ');
    },
    paragraph(sentenceCount) {
      const n = sentenceCount || rand(4, 8);
      return this.sentences(n);
    },
    paragraphs(count = 3) {
      return Array.from({ length: count }, () => this.paragraph()).join('\n\n');
    },
  },

  // -- Numbers --
  number: {
    int(min = 0, max = 100) {
      return rand(min, max);
    },
    float(min = 0, max = 100, decimals = 2) {
      const val = Math.random() * (max - min) + min;
      return parseFloat(val.toFixed(decimals));
    },
    range(min = 0, max = 100, count = 10) {
      return Array.from({ length: count }, () => rand(min, max));
    },
  },

  // -- Dates --
  date: {
    past(years = 1) {
      const now = Date.now();
      const ms = rand(0, years * 365.25 * 24 * 3600 * 1000);
      return new Date(now - ms).toISOString();
    },
    future(years = 1) {
      const now = Date.now();
      const ms = rand(0, years * 365.25 * 24 * 3600 * 1000);
      return new Date(now + ms).toISOString();
    },
    between(from, to) {
      const start = new Date(from).getTime();
      const end = new Date(to).getTime();
      return new Date(rand(start, end)).toISOString();
    },
    generate() {
      return Math.random() > 0.5 ? this.past() : this.future();
    },
  },

  // -- UUID --
  uuid: {
    v4() {
      const hex = () => rand(0, 15).toString(16);
      const seg = (n) => Array.from({ length: n }, hex).join('');
      return `${seg(8)}-${seg(4)}-4${seg(3)}-${pick(['8','9','a','b'])}${seg(3)}-${seg(12)}`;
    },
    generate() { return this.v4(); },
  },

  // -- Colors --
  color: {
    hex() {
      return '#' + Array.from({ length: 6 }, () => rand(0, 15).toString(16)).join('');
    },
    rgb() {
      return { r: rand(0, 255), g: rand(0, 255), b: rand(0, 255) };
    },
    hsl() {
      return { h: rand(0, 360), s: rand(0, 100), l: rand(0, 100) };
    },
    generate(format = 'hex') {
      if (format === 'rgb') return this.rgb();
      if (format === 'hsl') return this.hsl();
      return this.hex();
    },
  },

  // -- Password --
  password: {
    generate(length = 16, complexity = 'high') {
      const lower = 'abcdefghijklmnopqrstuvwxyz';
      const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const digits = '0123456789';
      const symbols = '!@#$%^&*()-_=+[]{}|;:,.<>?';
      let pool = lower;
      if (complexity !== 'low') pool += upper + digits;
      if (complexity === 'high') pool += symbols;
      return Array.from({ length }, () => pool[rand(0, pool.length - 1)]).join('');
    },
  },

  // -- Credit Card (test patterns) --
  creditCard: {
    visa() {
      return '4' + Array.from({ length: 15 }, () => rand(0, 9)).join('');
    },
    mastercard() {
      const prefix = pick(['51','52','53','54','55']);
      return prefix + Array.from({ length: 14 }, () => rand(0, 9)).join('');
    },
    generate() {
      return Math.random() > 0.5 ? this.visa() : this.mastercard();
    },
  },

  // -- IP Address --
  ip: {
    v4() {
      return Array.from({ length: 4 }, () => rand(1, 254)).join('.');
    },
    v6() {
      return Array.from({ length: 8 }, () =>
        rand(0, 65535).toString(16).padStart(4, '0')
      ).join(':');
    },
    generate(version = 'v4') {
      return version === 'v6' ? this.v6() : this.v4();
    },
  },

  // -- URL --
  url: {
    generate() {
      const protocol = pick(['https', 'http']);
      const word = pick(LOREM_WORDS);
      const tld = pick(['com','org','net','io','dev','app','co']);
      const path = `/${pick(LOREM_WORDS)}/${pick(LOREM_WORDS)}`;
      return `${protocol}://${word}.${tld}${path}`;
    },
  },

  // -- User Profile (combined) --
  person: {
    generate(locale = 'en') {
      const firstName = generators.name.firstName(locale);
      const lastName = generators.name.lastName(locale);
      const fullName = locale === 'kr'
        ? `${lastName}${firstName}`
        : `${firstName} ${lastName}`;
      const country = locale === 'kr' ? 'KR' : 'US';
      return {
        id: generators.uuid.v4(),
        firstName,
        lastName,
        fullName,
        email: generators.email.generate(firstName),
        phone: generators.phone.generate(country),
        address: generators.address.generate(country),
        company: generators.company.generate(),
        avatar: `https://i.pravatar.cc/150?u=${rand(1, 99999)}`,
        birthDate: generators.date.past(50),
        createdAt: generators.date.past(2),
      };
    },
  },
};

// ---- custom schema resolver --------------------------------
function resolveSchema(schema) {
  const result = {};
  for (const [key, spec] of Object.entries(schema)) {
    result[key] = resolveField(spec);
  }
  return result;
}

function resolveField(spec) {
  if (typeof spec !== 'string') return spec;

  // number:min-max
  const numMatch = spec.match(/^number:(\d+)-(\d+)$/);
  if (numMatch) return generators.number.int(+numMatch[1], +numMatch[2]);

  // float:min-max
  const floatMatch = spec.match(/^float:(\d+)-(\d+)$/);
  if (floatMatch) return generators.number.float(+floatMatch[1], +floatMatch[2]);

  const mapping = {
    'person.firstName': () => generators.name.firstName(),
    'person.lastName': () => generators.name.lastName(),
    'person.fullName': () => generators.name.fullName(),
    'person.fullNameKr': () => generators.name.fullName('kr'),
    'person.email': () => generators.email.generate(),
    'person.phone': () => generators.phone.generate(),
    'person.phoneKr': () => generators.phone.generate('KR'),
    'person.profile': () => generators.person.generate(),
    'person.profileKr': () => generators.person.generate('kr'),
    'address': () => generators.address.generate(),
    'address.us': () => generators.address.us(),
    'address.kr': () => generators.address.kr(),
    'company': () => generators.company.generate(),
    'text.word': () => generators.text.words(1),
    'text.sentence': () => generators.text.sentence(),
    'text.paragraph': () => generators.text.paragraph(),
    'uuid': () => generators.uuid.v4(),
    'date': () => generators.date.generate(),
    'date.past': () => generators.date.past(),
    'date.future': () => generators.date.future(),
    'color.hex': () => generators.color.hex(),
    'color.rgb': () => generators.color.rgb(),
    'color.hsl': () => generators.color.hsl(),
    'password': () => generators.password.generate(),
    'creditCard': () => generators.creditCard.generate(),
    'ip': () => generators.ip.v4(),
    'ip.v6': () => generators.ip.v6(),
    'url': () => generators.url.generate(),
    'boolean': () => Math.random() > 0.5,
  };

  const fn = mapping[spec];
  return fn ? fn() : spec;
}

module.exports = { generators, resolveSchema };
