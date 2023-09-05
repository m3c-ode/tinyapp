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
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};



app.get("/", (req, res) => {
  res.send("Welcome");
});

app.get("/urls", (req, res) => {
  const userId = req.cookies["user_id"];
  res.render("urls-index", { pageTitle: "TinyApp - URLs", urls: urlDatabase, user: users[userId] });
  // res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  // const username = req.cookies["username"];
  const userId = req.cookies["user_id"];
  res.render("urls-new", { user: users[userId], pageTitle: "TinyApp - New URL" });
});

app.get("/urls/:id", (req, res) => {
  // console.log('req.params', req.params);
  const { id } = req.params;
  const userId = req.cookies["user_id"];
  const templateVars = {
    id,
    pageTitle: "TinyApp - Details",
    longURL: urlDatabase[id],
    // username: req.cookies["username"],
    user: users[userId]
  };
  res.render("urls-show", templateVars);
  // res.json(urlDatabase);
  // res.send(req.params);
});

app.post("/urls/:id/delete", (req, res) => {
  const { id } = req.params;
  if (urlDatabase[id]) {
    delete urlDatabase[id];
  }
  res.redirect("/urls");
});
app.post("/urls/:id", (req, res) => {
  const { id } = req.params;
  const { newUrl } = req.body;
  if (urlDatabase[id]) {
    urlDatabase[id] = newUrl;
  }
  res.redirect("/urls");
});

app.get("/u/:id", (req, res) => {
  const { id } = req.params;
  res.redirect(urlDatabase[id]);
});

app.post("/urls", (req, res) => {
  console.log("req.body", req.body);
  // urlDatabase
  let newId = generateRandomString();
  console.log("🚀 ~ file: express-server.js:43 ~ app.post ~ newId:", newId);
  let { longURL } = req.body;
  urlDatabase[newId] = longURL;
  res.redirect(`/urls/:${newId}`);
});

app.get("/register", (req, res) => {
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


app.post("/login", (req, res) => {
  const { username } = req.body;
  res.cookie("username", username);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
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
const findUser = function(email) {
  for (const user in users) {
    if (Object.hasOwnProperty.call(users, user)) {
      const userObj = users[user];
      if (userObj[email]) {
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
