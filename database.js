const bcrypt = require('bcryptjs');

/**
 * @type {{[key: string]: {longUrl: string, userId: string, count: number, uniqueVisitors: string[], allVisits: {visitorId: string, timestamp: Date}[]}}}
 */
const urlDatabase = {
  "b2xVn2": {
    longUrl: "http://www.lighthouselabs.ca",
    userId: "aJ48lW",
    count: 0,
    uniqueVisitors: [],
    allVisits: []
  },
  "9sm5xK": {
    longUrl: "http://www.google.com",
    userId: "aJ48lW",
    count: 0,
    uniqueVisitors: [],
    allVisits: []

  },
  b6UTxQ: {
    longUrl: "https://www.tsn.ca",
    userId: "test",
    count: 0,
    uniqueVisitors: [],
    allVisits: []
  },
  i3BoGr: {
    longUrl: "https://www.google.ca",
    userId: "test",
    count: 0,
    uniqueVisitors: [],
    allVisits: []
  },
};

/**
 * @type {Object<string, {id: string, email: string, password: string}}
 */
const usersDatabase = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  aJ48lW: {
    id: "aJ48lW",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
  test: {
    id: "test",
    email: "test@test.ca",
    password: bcrypt.hashSync("test", 10),
  },
};

module.exports = { usersDatabase, urlDatabase };