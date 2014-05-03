var express = require('express');
var app = express();
var homeController = require('./server/controllers/homeController');
var accountController = require('./server/controllers/accountController');
var expressConfig = require('./server/config/expressConfig');
var passportConfig = require('./server/config/passportConfig');

String.prototype.bool = function() {
  return (/^true$/i).test(this);
};

var authorized = function(req, res, next) {
  if(!req.user) {
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

app.listen(process.env.PORT);
