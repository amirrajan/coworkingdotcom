var express = require('express');
var app = express();
var homeController = require('./server/controllers/homeController');
var accountController = require('./server/controllers/accountController');
var expressConfig = require('./server/config/expressConfig');
var passportConfig = require('./server/config/passportConfig');
var accessList = [];
var env = process.env;
var Twitter = require('./server/models/twitter').Twitter;
var twitter = new Twitter(process.env);
var _ = require("underscore");

String.prototype.bool = function() {
  return (/^true$/i).test(this);
};

var error = function() {
  return function (err, body) {
    console.log("error: ", err);
  };
};

var hasAccess = function(user) {
  if(!user) return false;

  if(user.username == env.twitterMasterAccount) return true;

  return _.any(accessList.users, function(u) {
    return u.screen_name == user.username;
  });
};

var authorized = function(req, res, next) {
  if(!hasAccess(req.user)) {
    res.send(403);
  } else {
    next();
  }
}

app.attach = function(definition) {
  for(var g in definition.get) this.get(g, definition.get[g]);
  for(var p in definition.post) this.post(p, definition.post[p]);
  for(var p in definition.authget) this.get(p, authorized, definition.authget[p]);
  for(var p in definition.authpost) this.post(p, authorized, definition.authpost[p]);
};

expressConfig.init(app);
passportConfig.init(app);

app.attach(homeController.definition);
app.attach(accountController.definition);
app.get('/coordinators', function(req, res) { res.json(accessList); });

var refreshAccessList = function() {
  twitter.following({ count: 5000, screen_name: env.twitterMasterAccount }, error(), function(following) {
    accessList = following;
  });
};

refreshAccessList();

setInterval(function() { refreshAccessList(); }, 1000 * 60); //refresh access list every minute

app.listen(process.env.PORT);


