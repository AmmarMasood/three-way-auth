const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

module.exports = app => {
  //test
  app.get("/api/user/test", (req, res) => {
    res.status(200).send("Hey test is running here");
  });

  //alows user to register
  app.post("/api/user/register", (req, res) => {
    User.findOne({ "jwt.email": req.body.email }).then(user => {
      if (user) {
        res.status(404).send("User already exist");
      } else {
        const newUser = new User({
          method: "jwt",
          jwt: {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          }
        });

        bcrypt.genSalt(10, (err, salt) => {
          if (err) {
            throw err;
          }
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) {
              throw err;
            }
            newUser.jwt.password = hash;
            newUser
              .save()
              .then(user => {
                res.send(user);
              })
              .catch(err => res.status(400).send(err));
          });
        });
      }
    });
  });

  //allows user to signIN
  app.post("/api/user/signin", (req, res) => {
    User.findOne({ "jwt.email": req.body.email }).then(user => {
      if (!user) {
        res.status(404).send("User does not exist");
      } else {
        bcrypt.compare(req.body.password, user.jwt.password).then(isMatch => {
          if (isMatch) {
            const payload = {
              name: user.jwt.name,
              id: user._id,
              email: user.jwt.email
            };
            jwt.sign(
              payload,
              keys.secret,
              { expiresIn: 3600 },
              (err, token) => {
                if (err) throw err;
                res.send({ success: "true", token: "Bearer " + token });
              }
            );
          } else {
            res.status(404).send("Cant login");
          }
        });
      }
    });
  });

  app.post("/api/user/oauth-google", (req, res) => {
    const email = req.body.email;
    const id = req.body.googleId;
    const name = req.body.name;
    // check if user already exists
    User.findOne({ "google.id": id }).then(user => {
      if (user) {
        const payload = {
          name: user.google.name,
          id: user._id,
          email: user.google.email
        };
        jwt.sign(payload, keys.secret, { expiresIn: 3600 }, (err, token) => {
          if (err) throw err;
          res.send({ success: "true", token: "Bearer " + token });
        });
      } else {
        //if there is no user create one and then create a token and send it as aresponse

        const newUser = new User({
          method: "google",
          google: {
            id: id,
            name: name,
            email: email
          }
        });
        newUser.save().then(user => {
          const payload = {
            name: user.google.name,
            id: user._id,
            email: user.google.email
          };
          jwt.sign(payload, keys.secret, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.send({ success: "true", token: "Bearer " + token });
          });
        });
      }
    });
  });

  app.post("/api/user/oauth-facebook", (req, res) => {
    const email = req.body.email;
    const id = req.body.userID;
    const name = req.body.name;
    // check if user already exists
    User.findOne({ "facebook.id": id }).then(user => {
      if (user) {
        const payload = {
          name: user.facebook.name,
          id: user._id,
          email: user.facebook.email
        };
        jwt.sign(payload, keys.secret, { expiresIn: 3600 }, (err, token) => {
          if (err) throw err;
          res.send({ success: "true", token: "Bearer " + token });
        });
      } else {
        //if there is no user create one and then create a token and send it as aresponse
        const newUser = new User({
          method: "facebook",
          facebook: {
            id: id,
            name: name,
            email: email
          }
        });
        newUser.save().then(user => {
          const payload = {
            name: user.facebook.name,
            id: user._id,
            email: user.facebook.email
          };
          jwt.sign(payload, keys.secret, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.send({ success: "true", token: "Bearer " + token });
          });
        });
      }
    });
  });
};
