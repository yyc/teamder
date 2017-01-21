var passport = require('passport');
var passportJwt = require('passport-jwt');
var passportRM = require('passport-remember-me');
var secrets = require('./secrets');
var jwt = require('jsonwebtoken');

class Auth {
  constructor(db){
    // Requires db
    this.globals = globals;
    db.User.prototype.payload = function(){
      return {
        id: this.id,
        projectId: this.projectId
      }
    }
  }
  strategy(){
    return new passportJwt.Strategy({
      ...secrets.jwt,
      jwtFromRequest: passportJwt.ExtractJwt.fromUrlQueryParameter("login")
    }, function(payload, done){
      User.findOne({id: payload.id})
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
    {...secrets.jwt,
    options});
  }


}
module.exports = Auth
