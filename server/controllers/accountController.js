var passport = require('passport')
var env = process.env;
var definition = {
  get: { },
  post: { }
};

definition.get['/twitter'] = passport.authenticate('twitter');

definition.get['/authenticate'] = passport.authenticate('twitter', {
  successRedirect: '/',
  failureRedirect: '/'
});

module.exports.definition = definition;
