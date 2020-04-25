const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://dbUser:dbPassword@mern-tutorial-sz7yw.mongodb.net/test?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then(() => console.log("connected to DB"))
  .catch(error => console.log(error));

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(5000);
