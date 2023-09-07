const express = require('express');
const router = express.Router();
// const packageName = require('packageName');
const { urlDatabase, usersDatabase } = require("../database");
const { generateRandomString, getUserUrls } = require("../helper-functions");


// replace all the app. routes with router. routes from the app, in this file

// implied /urls, from the express.server middelware set-up
router.get("/", (req, res) => {

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
});
router.post("/", (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    // Unauthorized
    return res.sendStatus(401);
  }
  let newId = generateRandomString();
  let { longUrl } = req.body;
  urlDatabase[newId] = {
    longUrl,
    userId,
    count: 0,
    uniqueVisitors: [],
    allVisits: []
  };
  res.redirect(`/urls/${newId}`);
});

router.get("/new", (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.redirect("/login");
  }
  res.render("urls-new", { user: usersDatabase[userId], pageTitle: "tinyapp - New URL" });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  if (!urlDatabase[id]) {
    // Not found
    res.status(404);
    return res.send("Can not access. This URL does not exist");
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
    count: urlDatabase[id].count,
    uniqueVisitors: urlDatabase[id].uniqueVisitors.length,
    allVisits: urlDatabase[id].allVisits
  };
  res.render("urls-show", templateVars);
});

router.put("/:id", (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    // Unauthorized
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
  // relative to current URL
  res.redirect("./");
});

router.delete("/:id", (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    // Unauthorized
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
  // Relative to root of host name
  res.redirect("/urls");
});

module.exports = router;