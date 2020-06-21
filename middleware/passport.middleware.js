const { ExtractJwt, Strategy } = require("passport-jwt");
const { Login } = require("../models");
const config = require("../config/jwt-config");
module.exports = function (passport) {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = config.login.jwtEncryption;
  passport.use(
    new Strategy(opts, function (jwt_payload, done) {
      Login.findOne({ where: { id: jwt_payload.userId } })
        .then((user) => {
          if (user) return done(null, user);
          else return done(null, false);
        })
        .catch((err) => {
          return done(err, false);
        });
    })
  );
};
