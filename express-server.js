const express = require('express');
const cookieSession = require("cookie-session");
const { generateRandomString, getUserUrls, findUser, doesExist } = require("./helper-functions");
const bcrypt = require('bcryptjs');
const methodOverride = require('method-override');
const app = express();
const PORT = 8080;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: [generateRandomString(10)],
  maxAge: 12 * 60 * 60 * 1000
}));
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');

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



app.get("/", (req, res) => {
  res.render("index", { pageTitle: "tinyapp - tiny url shortener" });
});

//URLS end point

app.get("/urls", (req, res) => {

  //From cookie-parser to cookieSession
  // const userId = req.cookies["user_id"];
  const userId = req.session.userId;

  if (!userId) {
    // Unauthorized
    // res.set("Content-Type", "text/html");
    res.status(401);
    return res.send(`<p>Only logged in users can see URLs. Access the login page here: <a href='/login'>Login page</a><p>`);
  } else {
    const userUrls = getUserUrls(userId, urlDatabase);
    res.render("urls-index", { pageTitle: "tinyapp - URLs", urls: userUrls, user: usersDatabase[userId] });
  }
  // res.json(urlDatabase);
});
app.post("/urls", (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    // Unauthorized
    // res.send("Only logged in users can create new URLs");
    return res.sendStatus(401);
    // res.redirect("/login");
  }
  // urlDatabase
  let newId = generateRandomString();
  let { longUrl } = req.body;
  urlDatabase[newId] = {
    longUrl,
    userId
  };
  res.redirect(`/urls/${newId}`);
});

app.get("/urls/new", (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.redirect("/login");
  }
  res.render("urls-new", { user: usersDatabase[userId], pageTitle: "tinyapp - New URL" });
});

app.get("/urls/:id", (req, res) => {
  // console.log('req.params', req.params);
  const { id } = req.params;
  if (!urlDatabase[id]) {
    // Not found
    // res.send("Can not access. This URL does not exist");
    return res.sendStatus(404);
  }
  const userId = req.session.userId;
  if (!userId) {
    // Unauthorized
    res.status(401);
    return res.send(`<p>Only logged in users can see URLs. Access the login page here: <a href='/login'>Login page</a><p>`);
  }
  // Only owners can see their URL - Unauthorized code sent otherwise
  if (urlDatabase[id].userId !== userId) {
    res.status(401);
    return res.send(`<p>This page is for owners<p>`);
  }
  const templateVars = {
    id,
    pageTitle: "TinyApp - Details",
    longUrl: urlDatabase[id].longUrl,
    user: usersDatabase[userId],
    count: urlDatabase[id].count ? urlDatabase[id].count : 0
  };
  res.render("urls-show", templateVars);
  // res.json(urlDatabase);
  // res.send(req.params);
});

app.put("/urls/:id", (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    // Unauthorized
    // res.send("Only logged in users can edit URLs");
    return res.sendStatus(401);
  }
  const { id } = req.params;
  if (!urlDatabase[id]) {
    return res.sendStatus(404);
  }
  // Only owners can edit their URL - Unauthorized code sent otherwise
  if (urlDatabase[id].userId !== userId) {
    return res.sendStatus(401);
  }
  const { newUrl } = req.body;
  // Can not send an empty string
  if (!newUrl) {
    return res.sendStatus(400);
  }
  if (urlDatabase[id]) {
    urlDatabase[id].longUrl = newUrl;
  }
  res.redirect("/urls");
});

app.delete("/urls/:id", (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    // Unauthorized
    // res.send("Only logged in users can delete URLs");
    return res.sendStatus(401);
  }
  const { id } = req.params;
  // Resource not found
  if (!urlDatabase[id]) {
    return res.sendStatus(404);
  }
  // Only owners can delete their URL - Unauthorized code sent otherwise
  if (urlDatabase[id].userId !== userId) {
    return res.sendStatus(401);
  }
  if (urlDatabase[id]) {
    delete urlDatabase[id];
  }
  res.redirect("/urls");
});

// Tiny URL redirect - Unprotected, everyone can have access
app.get("/u/:id", (req, res) => {
  const { id } = req.params;
  if (!urlDatabase[id]) {
    // Not found
    res.status(404);
    return res.send("Can not access. This URL does not exist");
    // res.sendStatus(404);
  }
  if (!urlDatabase[id].count) {
    urlDatabase[id].count = 1;
  } else {
    urlDatabase[id].count++;
  }

  res.redirect(urlDatabase[id].longUrl);
});

// Authentication - Register and Login endpoints
app.get("/register", (req, res) => {
  const userId = req.session.userId;
  if (userId) {
    return res.redirect("/urls");
  }
  res.render("registration", { pageTitle: "tinyapp - Register", user: undefined });
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.sendStatus(400).send("Bad request - Incomplete form");
    // res.send("Form was not complete");
  }
  if (doesExist(email, usersDatabase)) {
    return res.status(400).send("Bad Request - User already exists");
  }
  const newUserId = generateRandomString();
  usersDatabase[newUserId] = {
    id: newUserId,
    email,
    password: bcrypt.hashSync(password, 10)
  };

  req.session.userId = newUserId;
  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  const userId = req.session.userId;
  if (userId) {
    return res.redirect("/urls");
  }
  res.render("login", { pageTitle: "tinyapp - Login", user: undefined });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  // compare with hashed password
  // const hashedPwd = bcrypt.compareSync(password, hash);
  const user = findUser(email, usersDatabase);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    res.status(403);
    return res.send("Invalid credentials");
    // return res.sendStatus(403);
  }
  req.session.userId = user.id;
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.clearCookie("userId");
  res.redirect("/login");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});