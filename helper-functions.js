const generateRandomString = function(length = 6) {
  let newId = '';
  const set = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let index = 0; index < length; index++) {
    let randomIndex = Math.floor(Math.random() * set.length);
    newId += set[randomIndex];
  }
  return newId;
};

// looks up if user already exists in our data with its email
const findUser = function(email, database) {
  for (const user in database) {
    if (Object.hasOwnProperty.call(database, user)) {
      const userObj = database[user];
      if (userObj.email === email) {
        return userObj;
      }
    }
  }
  return null;
};
// looks up if user already exists in our data
const doesExist = function(email, database) {
  for (const user in database) {
    console.log("🚀 ~ file: express-server.js:168 ~ doesExist ~ user:", user);
    if (Object.hasOwnProperty.call(database, user)) {
      const userObj = database[user];
      console.log("🚀 ~ file: express-server.js:171 ~ doesExist ~ userObj:", userObj);
      if (userObj.email === email) {
        return true;
      }
    }
  }
  return false;
};

const getUserUrls = function(userId, database) {
  let userUrls = [];
  for (const id in database) {
    if (Object.hasOwnProperty.call(database, id)) {
      const element = database[id];
      if (element.userId === userId) {
        userUrls.push({ id, longUrl: element.longUrl });
      }
    }
  }
  return userUrls;
};


module.exports = { generateRandomString, getUserUrls, findUser, doesExist };