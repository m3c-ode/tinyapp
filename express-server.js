const express = require('express');
const cookieSession = require("cookie-session");
const {
  addNewUserToDb,
  generateRandomString,
  verifyUser,
  addCountVisitToUrl,
  addVisitInformation } = require("./helper-functions");
const methodOverride = require('method-override');
const { urlDatabase, usersDatabase } = require("./database");
const urlsRouter = require("./routes/urlsRoutes");
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

// List of URLS REST Endpoints
app.use('/urls', urlsRouter);

app.set('view engine', 'ejs');

// Home
app.get("/", (req, res) => {
  res.render("index", { pageTitle: "tinyapp - tiny url shortener" });
});

// URLS end point
// Tiny URL redirect - Unprotected, everyone can have access
app.get("/u/:id", (req, res) => {
  const { userId } = req.session;
  const { id } = req.params;
  if (!urlDatabase[id]) {
    // Not found
    res.status(404);
    return res.send("This URL can not be found");
  }

  addCountVisitToUrl(id, urlDatabase);

  addVisitInformation(userId, id, urlDatabase);

  res.redirect(urlDatabase[id].longUrl);
});


// Authentication - Register, Login and Logout endpoints
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
    res.status(400);
    return res.send("Bad request - Incomplete form");
  }
  const user = addNewUserToDb(email, password, usersDatabase);

  if (!user) {
    res.status(400);
    return res.send("Bad Request - User already exists");
  }

  req.session.userId = user.id;
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
  const user = verifyUser(email, password, usersDatabase);
  if (!user) {
    res.status(403);
    return res.send("Invalid credentials");
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
