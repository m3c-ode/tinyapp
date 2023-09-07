const bcrypt = require('bcryptjs');

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

const addNewUserToDb = function(email, password, usersDatabase) {
  if (doesExist(email, usersDatabase)) {
    return false;
  }
  const newUserId = generateRandomString();
  usersDatabase[newUserId] = {
    id: newUserId,
    email,
    password: bcrypt.hashSync(password, 10)
  };
  return usersDatabase[newUserId];
};

const verifyUser = function(email, password, usersDatabase) {
  const user = findUser(email, usersDatabase);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return null;
  }
  return user;
};


const getCurrentUserMiddleware = function(database, req, res, next) {
  const { userId } = req.session;
  const user = database[userId];
  req.user = user;
  next();
};

const addCountVisitToUrl = function(id, urlDatabase) {
  if (!urlDatabase[id].count) {
    urlDatabase[id].count = 1;
  } else {
    urlDatabase[id].count++;
  }
};

const addVisitInformation = function(userId, urlId, urlDatabase) {
  const visitorId = userId || generateRandomString(6);
  let visit = {
    visitorId,
    timestamp: Date.now()
  };
  // Add unique visitors that are logged in.
  if (!urlDatabase[urlId].uniqueVisitors.includes(visitorId)) {
    urlDatabase[urlId].uniqueVisitors.push(visitorId);
  }
  // Add visit details to DB
  urlDatabase[urlId].allVisits.push(visit);
};



module.exports = {
  addVisitInformation,
  addCountVisitToUrl,
  verifyUser,
  addNewUserToDb,
  generateRandomString,
  getUserUrls,
  getCurrentUserMiddleware
};