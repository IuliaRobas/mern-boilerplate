const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: { type: String, maxlength: 50 },
  email: { type: String, trim: true, unique: 1 },
  password: { type: String, minlength: 5 },
  lastName: { type: String, maxlength: 50 },
  role: { type: Number, default: 0 },
  token: { type: String },
  tokenExp: {
    type: Number
  }
});

userSchema.pre("save", function(next) {
  var user = this;

  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, function(error, salt) {
      if (error) return next(error);
      bcrypt.hash(user.password, salt, function(error, hash) {
        if (error) return next(error);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function(plainPassword, callback) {
  bcrypt.compare(plainPassword, this.password, function(error, isMatch) {
    if (error) return callback(error);
    callback(null, isMatch);
  });
};

userSchema.methods.generateToken = function(callback) {
  var user = this;
  var token = jwt.sign(user._id.toHexString(), "secret");
  console.log(user);
  user.token = token;
  user.save(function(error, user) {
    if (error) return callback(error);
    callback(null, user);
  });
};

userSchema.statics.findByToken = function(token, callback) {
  var user = this;
  jwt.verify(token, "secret", function(error, decoded) {
    user.findOne({ _id: decoded, token: token }, function(error, user) {
      if (error) return callback(error);
      callback(null, user);
    });
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
