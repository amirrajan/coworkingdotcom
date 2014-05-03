var passport = require('passport')
var TwitterStrategy = require('passport-twitter').Strategy;
var users = require('../models/users');
var env = process.env;

function init(app) {
  passport.use(new TwitterStrategy({
    consumerKey: env.twitterConsumerKey,
    consumerSecret: env.twitterConsumerSecret,
    callbackURL: env.twitterCallbackUrl
  }, function(token, tokenSecret, profile, done) {
    users.set({
      id: profile.id,
      username: profile.username,
      avatar: profile.photos[0].value
    }, done); 
  }));

  passport.serializeUser(function (user, done) { done(null, user.id); });
  passport.deserializeUser(function (id, done) { users.get(id, done); });

  app.use(passport.initialize());
  app.use(passport.session());
}

module.exports.init = init;
