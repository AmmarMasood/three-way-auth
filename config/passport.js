const passport = require("passport");
const googlePlusTokenStrategy = require("passport-google-plus-token");
const mongoose = require("mongoose");
const User = mongoose.model("users");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("./keys");
const CLIENT_ID = require("./keys").googleClientId;
const CLIENT_SECRET = require("./keys").googleClientSecret;

const opts = {
  //this is extracting the token as BEARER FROM HEADER
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.secret
};
module.exports = passport => {
  passport.use(
    new JWTStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id).then(user => {
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      });
    })
  );

  //GOOGLE TOKEN STRATEGY
  passport.use(
    new GoogleStrategy(
      {
        // options for strategy
        callbackURL: "/auth-success",
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        proxy: true
      },
      (accessToken, refreshToken, profile, done) => {
        // console.log("Acess Token: ", accessToken);
        // console.log("Profile: ", profile);
        // console.log("Refresh Token: ", refreshToken);
        const email = profile.emails[0].value;
        const id = profile.id;
        const name = profile.displayName;
        // check if user already exists
        User.findOne({ "google.id": id }).then(user => {
          if (user) {
            done(null, user);
          } else {
            const newUser = new User({
              method: "google",
              google: {
                id: id,
                name: name,
                email: email
              }
            });
            newUser.save();
            done(null, newUser);
          }
        });
      }
    )
  );
};
