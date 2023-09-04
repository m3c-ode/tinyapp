const express = require('express');
const app = express();
const PORT = 8080;

// middleware
app.use(express.json());
app.use(express.urlencoded());

app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};



app.get("/", (req, res) => {
  res.send("Welcome");
});

app.get("/urls", (req, res) => {
  res.render("urls-index", { urls: urlDatabase });
  // res.json(urlDatabase);
});

app.get("/urls/:id", (req, res) => {
  // console.log('req.params', req.params);
  const { id } = req.params;
  res.render("urls-show", { id, longURL: urlDatabase[id] });
  // res.json(urlDatabase);
  // res.send(req.params);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});