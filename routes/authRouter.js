const express = require("express");
const authRouter = express.Router();
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");

//SIGNUP
authRouter.post("/signup", (req, res, next) => {
  User.findOne({ username: req.body.username.toLowerCase() }, (err, user) => {
    if (err) {
      res.status(500);
      return next(err);
    }
    if (user) {
      res.status(403);
      return next(new Error("That username is already taken."));
    }

    const newUser = new User(req.body);

    // if(req.body.adminCode === "secretcode"){          //checks to see if user has admin code
    //     newUser.isAdmin = true;
    // }
    //this is where the pre-save hook for bcrypt would fire & hash the password before it saves teh new User on line 26 right below
    newUser.save((err, savedUser) => {
      if (err) {
        res.status(500);
        return next(err);
      }
      //payload                   //secret
      const token = jwt.sign(savedUser.withoutPassword(), process.env.SECRET);

      return res.status(201).send({ token, user: savedUser.withoutPassword() });
    });
  });
});

//LOGIN
authRouter.post("/login", (req, res, next) => {
  User.findOne({ username: req.body.username.toLowerCase() }, (err, user) => {
    if (err) {
      res.status(500);
      return next(err);
    }
    if (!user) {
      res.status(403);
      return next(new Error("Username or password is incorrect."));
    }
    user.checkPassword(req.body.password, (err, isMatch) => {
      if (err) {
        res.status(403);
        return next(new Error("Username or password is incorrect"));
      }
      if (!isMatch) {
        res.status(403);
        return next(new Error("Username or password is incorrect"));
      }

      const token = jwt.sign(user.withoutPassword(), process.env.SECRET);
      return res.status(200).send({ token, user: user.withoutPassword() });
    });
  });
});

module.exports = authRouter;
