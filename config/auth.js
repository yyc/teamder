var passport = require('passport');
var passportJwt = require('passport-jwt');
var passportRM = require('passport-remember-me');
var secrets = require('./secrets');
var jwt = require('jsonwebtoken');

class Auth {
  constructor(db){
    // Requires db
    this.globals = globals;
    this.jwt =
  }
  strategy(){
    return new passportJwt.Strategy({
      ...secrets.jwt,
      jwtFromRequest: passportJwt.ExtractJwt.fromUrlQueryParameter("login")
    });
  }
  encode(payload, options){
    return jwt.sign(payload, secrets.jwt.privateKey,
    {...secrets.jwt,
    options});
  }


}
module.exports = Auth
