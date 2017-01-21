var passport = require('passport');
var passportJwt = require('passport-jwt');
var passportRM = require('passport-remember-me');
var secrets = require('./secrets');
var jwt = require('jsonwebtoken');

class Auth {
  constructor(globals){
    // Requires db
    this.db = globals.db;
    passport.use(Auth.strategy());
    globals.passport = passport;
  }
  static strategy(){
    var self = this;
    return new passportJwt.Strategy(
      Object.assign({},
      secrets.jwt,
      {jwtFromRequest: passportJwt.ExtractJwt.fromUrlQueryParameter("login")}
      )
    , function(payload, done){
      self.User.findOne({id: payload.id})
        .then(function(user){
          done(null, user)
        })
        .error(function(error){
          done(error);
        })
    });
  }
  jwtForUser(user){
    return jwt.sign(user.payload(), secrets.jwt.privateKey,
    Object.assign({},
      secrets.jwt,
      options
    ));
  }


}
module.exports = Auth
