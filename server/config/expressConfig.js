var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var env = process.env;

function init(app) {
  app.set('view engine', 'ejs');
  app.use(express.static("public"));
  app.use(express.static("bower_components"));
  app.use(bodyParser.urlencoded());
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(cookieSession({
    secret: env.cookieSecret,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 365 * 10 }
  }));
}

module.exports.init = init;
