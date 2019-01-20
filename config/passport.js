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
};
