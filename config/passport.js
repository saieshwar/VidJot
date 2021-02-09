const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//Load user model
const User = mongoose.model("users");

module.exports = function (passport) {
  //once we submit login for it hits post and checks the local which is here
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      console.log(email);
      //Match user
      User.findOne({
        email: email,
      }).then((user) => {
        if (!user) {
          return done(null, false, { message: "No user found" });
        }

        //Match passwords
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "password Incorrect" });
          }
        });
      });
    })
  );
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
