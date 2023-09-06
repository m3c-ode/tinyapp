const express = require('express');
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('view engine', 'ejs');

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

const users = {
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
    password: "test",
  },
};



app.get("/", (req, res) => {
  res.send("Welcome");
});

//URLS end point

app.get("/urls", (req, res) => {
  const userId = req.cookies["user_id"];
  console.log("🚀 ~ file: express-server.js:46 ~ app.get ~ userId:", userId);
  if (!userId) {
    // Unauthorized
    // res.set("Content-Type", "text/html");
    res.status(401);
    res.send(`<p>Only logged in users can see URLs. Access the login page here: <a href='/login'>Login page</a><p>`);
  } else {
    res.render("urls-index", { pageTitle: "TinyApp - URLs", urls: urlDatabase, user: users[userId] });
  }
  // res.json(urlDatabase);
});
app.post("/urls", (req, res) => {
  const userId = req.cookies["user_id"];
  if (!userId) {
    // Unauthorized
    // res.send("Only logged in users can create new URLs");
    res.sendStatus(401);
    // res.redirect("/login");
  }
  // urlDatabase
  let newId = generateRandomString();
  console.log("🚀 ~ file: express-server.js:43 ~ app.post ~ newId:", newId);
  let { longUrl } = req.body;
  urlDatabase[newId] = {
    longUrl,
    userId
  };
  // .longUrl = longUrl;
  // urlDatabase[newId].userId = userId;
  res.redirect(`/urls/${newId}`);
});

app.get("/urls/new", (req, res) => {
  const userId = req.cookies["user_id"];
  if (!userId) {
    res.redirect("/login");
  }
  res.render("urls-new", { user: users[userId], pageTitle: "TinyApp - New URL" });
});

app.get("/urls/:id", (req, res) => {
  // console.log('req.params', req.params);
  const { id } = req.params;
  if (!urlDatabase[id]) {
    // Not found
    // res.send("Can not access. This URL does not exist");
    res.sendStatus(404);
  }
  const userId = req.cookies["user_id"];
  if (!userId) {
    // Unauthorized
    // res.send("Only logged in users can edit URLs");
    res.sendStatus(401);
  }
  const templateVars = {
    id,
    pageTitle: "TinyApp - Details",
    longUrl: urlDatabase[id].longUrl,
    user: users[userId]
  };
  res.render("urls-show", templateVars);
  // res.json(urlDatabase);
  // res.send(req.params);
});

app.post("/urls/:id/delete", (req, res) => {
  const userId = req.cookies["user_id"];
  if (!userId) {
    // Unauthorized
    // res.send("Only logged in users can delete URLs");
    res.sendStatus(401);
  }
  const { id } = req.params;
  if (urlDatabase[id]) {
    delete urlDatabase[id];
  }
  res.redirect("/urls");
});
app.post("/urls/:id", (req, res) => {
  const userId = req.cookies["user_id"];
  if (!userId) {
    // Unauthorized
    // res.send("Only logged in users can edit URLs");
    res.sendStatus(401);
  }
  const { id } = req.params;
  const { newUrl } = req.body;
  if (urlDatabase[id]) {
    urlDatabase[id].longUrl = newUrl;
  }
  res.redirect("/urls");
});

// Tiny URL redirect - Unprotected, everyone can have access
app.get("/u/:id", (req, res) => {
  const { id } = req.params;
  if (!urlDatabase[id]) {
    // Not found
    res.status(404);
    res.send("Can not access. This URL does not exist");
    // res.sendStatus(404);
  }
  res.redirect(urlDatabase[id].longUrl);
});

// Authentication - Register and Login endpoints
app.get("/register", (req, res) => {
  const userId = req.cookies["user_id"];
  if (userId) {
    res.redirect("/urls");
  }
  res.render("registration", { pageTitle: "TinyApp - Register", user: undefined });
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.sendStatus(400).send("Bad request - Incomplete form");
    // res.send("Form was not complete");
  }
  console.log("🚀 ~ file: express-server.js:108 ~ app.post ~ doesExist(email):", doesExist(email));
  if (doesExist(email)) {
    res.status(400).send("Bad Request - User already exists");
  }
  const newUserId = generateRandomString();
  users[newUserId] = {
    id: newUserId,
    email,
    password
  };

  res.cookie("user_id", newUserId);
  console.log('users list', users);
  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  const userId = req.cookies["user_id"];
  if (userId) {
    res.redirect("/urls");
  }
  res.render("login", { pageTitle: "TinyApp - Login", user: undefined });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = findUser(email, password);
  if (!user) {
    res.sendStatus(403);
  }
  res.cookie("user_id", user.id);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

const generateRandomString = function() {
  let newId = '';
  const set = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let index = 0; index < 6; index++) {
    let randomIndex = Math.floor(Math.random() * set.length);
    newId += set[randomIndex];
  }
  return newId;
};

// looks up if user already exists in our data
const findUser = function(email, password) {
  for (const user in users) {
    if (Object.hasOwnProperty.call(users, user)) {
      const userObj = users[user];
      if (userObj.email === email && userObj.password === password) {
        return userObj;
      }
    }
  }
  return null;
};
// looks up if user already exists in our data
const doesExist = function(email) {
  for (const user in users) {
    console.log("🚀 ~ file: express-server.js:168 ~ doesExist ~ user:", user);
    if (Object.hasOwnProperty.call(users, user)) {
      const userObj = users[user];
      console.log("🚀 ~ file: express-server.js:171 ~ doesExist ~ userObj:", userObj);
      if (userObj.email === email) {
        return true;
      }
    }
  }
  return false;
};
