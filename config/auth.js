var passport = require('passport');
var passportJwt = require('passport-jwt');
var passportRM = require('passport-remember-me');
var secrets = require('./secrets');
var jwt = require('jsonwebtoken');

class Auth {
  constructor(globals){
    // Requires db
    this.db = globals.db;
    this.url = secrets.url;
    passport.use(Auth.strategy(globals.db));
    globals.passport = passport;
  }
  static strategy(db){
    return new passportJwt.Strategy(
      Object.assign({},
      secrets.jwt,
      {jwtFromRequest: passportJwt.ExtractJwt.fromUrlQueryParameter("login")}
      )
    , function(payload, done){
      db.User.findOne({id: payload.id})
        .then(function(user){
          done(null, user)
        })
        .error(function(error){
          done(error);
        })
    });
  }
  jwtForUser(user){
    return jwt.sign(user.payload(), secrets.jwt.secretOrPrivateKey,
    { algorithm: secrets.jwt.algorithms[0],
    expiresIn: "10 days"});
  }


}
module.exports = Auth
