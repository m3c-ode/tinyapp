const { assert } = require('chai');

const { findUser, getUserUrls, doesExist } = require('../helper-functions');

/**
 * @type {Object<string, {id: string, email: string, password: string}}
 */
const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

/**
 * @type {{[key: string]: {longUrl: string, userId: string}}}
 */
const urlDatabase = {
  "b2xVn2": {
    longUrl: "http://www.lighthouselabs.ca",
    userId: "aJ48lW",
  },
  "9sm5xK": {
    longUrl: "http://www.google.com",
    userId: "aJ48lW",
  },
  b6UTxQ: {
    longUrl: "https://www.tsn.ca",
    userId: "test",
  },
  i3BoGr: {
    longUrl: "https://www.google.ca",
    userId: "test",
  },
};

describe("findUser", () => {
  const user = findUser("user@example.com", testUsers);
  const expectedUserID = "userRandomID";
  it("should return a user with a valid email", () => {
    assert.deepEqual(user, testUsers[expectedUserID]);
  });
  it("user ids should match", () => {
    assert.strictEqual(user.id, expectedUserID);
  });
  it("should return undefined if no email is passed", () => {
    assert.isUndefined(findUser('', testUsers));
  });
  it("should return null if email is not found", () => {
    assert.isNull(findUser('notindatabase', testUsers));
  });
});

describe("doesExist", () => {
  it("should return true if the user is in the database", () => {
    assert.isTrue(doesExist("user@example.com", testUsers));
  });
  it("should return false if user is not in database", () => {
    assert.isFalse(doesExist("something", testUsers));
  });
  it("should return undefined if no email is passed", () => {
    assert.isUndefined(doesExist("", testUsers));
  });
});



describe("getUsersUrls", () => {
  const userId = "test";
  const expectedResult = [
    {
      id: "b6UTxQ",
      longUrl: "https://www.tsn.ca",
    },
    {
      id: "i3BoGr",
      longUrl: "https://www.google.ca",
    }
  ];
  it("should return an array of id, longUrl objects associated with the user's id from the urlDatabase", () => {
    assert.deepEqual(getUserUrls(userId, urlDatabase), expectedResult);
  });
  it("should return an empty array if the user is not in the url database", () => {
    assert.deepEqual(getUserUrls('someid', urlDatabase), []);
  });

  // If the databases needed to be related, we could also test those cases...
});