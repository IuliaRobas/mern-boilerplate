const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const config = require("./config/key");

const { User } = require("./models/user");

mongoose
  .connect(config.mongoURI, { useNewUrlParser: true })
  .then(() => console.log("connected to DB"))
  .catch(error => console.log(error));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json("heya");
});

app.post("/api/users/register", (req, res) => {
  const user = new User(req.body);
  user.save((error, userData) => {
    if (error) return res.json({ success: false, error });

    return res.status(200).json({ success: true });
  });
});

app.listen(5000);
