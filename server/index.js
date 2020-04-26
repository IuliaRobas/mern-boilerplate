const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const config = require("./config/key");

const { User } = require("./models/user");
const { auth } = require("./middleware/auth");

mongoose
  .connect(config.mongoURI, { useNewUrlParser: true })
  .then(() => console.log("connected to DB"))
  .catch(error => console.log(error));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.get("/api/user/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req._id,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastName: req.user.lastName,
    role: req.user.role
  });
});

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

app.post("/api/user/login", (req, res) => {
  User.findOne({ email: req.body.email }, (error, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: "Login failed - email not found"
      });

    user.comparePassword(req.body.password, (error, isMatch) => {
      if (!isMatch) {
        return res.json({ loginSuccess: false, message: "wrong password" });
      }
    });

    user.generateToken((error, user) => {
      if (error) return res.status(400).send(error);
      res
        .cookie("x_auth", user.token)
        .status(200)
        .json({ loginSuccess: true });
    });
  });
});

app.get("/api/user/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (error, doc) => {
    if (error) return res.json({ success: false, error });
    return res.status(200).send({ success: true });
  });
});

const port = process.env.PORT || 5000;

app.listen(port);
