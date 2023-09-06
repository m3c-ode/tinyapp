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
const findUser = function(email, usersDatabase) {
  if (!email) {
    return undefined;
  }
  for (const user in usersDatabase) {
    if (Object.hasOwnProperty.call(usersDatabase, user)) {
      const userObj = usersDatabase[user];
      if (userObj.email === email) {
        return userObj;
      }
    }
  }
  return null;
};
// looks up if user already exists in our data
const doesExist = function(email, usersDatabase) {
  if (!email) {
    return undefined;
  }
  for (const user in usersDatabase) {
    if (Object.hasOwnProperty.call(usersDatabase, user)) {
      const userObj = usersDatabase[user];
      if (userObj.email === email) {
        return true;
      }
    }
  }
  return false;
};

const getUserUrls = function(userId, urlDatabase) {
  let userUrls = [];
  for (const id in urlDatabase) {
    if (Object.hasOwnProperty.call(urlDatabase, id)) {
      const element = urlDatabase[id];
      if (element.userId === userId) {
        userUrls.push({ id, longUrl: element.longUrl });
      }
    }
  }
  return userUrls;
};


module.exports = { generateRandomString, getUserUrls, findUser, doesExist };