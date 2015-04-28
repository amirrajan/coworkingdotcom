var _ = require("underscore");
var querystring = require("querystring");
var cities = require('../models/cities');
var locations = require('../models/locations');
var history = require("../models/history");
var httpRequest = require('request');
var get = { };
var post = { };
var uuid = require('node-uuid');
var env = process.env;
var definition = {
  get: { },
  post: { },
  authget: { },
  authpost: { }
};

var Twitter = require('../models/twitter').Twitter;
var twitter = new Twitter(process.env);
var accessList = [];

var isMasterAccount = function(user) {
  if(!user) return false;

  return user.username.toLowerCase() == env.twitterMasterAccount.toLowerCase();
};

var allCities = function(callback) {
  cities.getall(function(err, allCities) {
    locations.getall(function(err, allLocations) {
      _.each(allCities, function(city) {
        city.locations = [];
      });

      _.each(allLocations, function(loc) {
        allCities[loc.cityId].locations.push(loc);
      });

      callback(allCities);
    });
  });
};

///////
//views
///////
definition.get['/'] = function(req, res) {
  allCities(function(all) {
    res.render('index', {
      u: _, user: req.user,
      all: all,
      masterAccount: env.twitterMasterAccount
    });
  });
};

definition.get['/n'] = function(req, res) {
  allCities(function(all) {
    res.render('old_index', { u: _, user: req.user, all: all });
  });
};

definition.get['/logout'] = function(req, res){
  req.logout();
  res.redirect('/');
};

definition.authget['/managecities'] = function(req, res) {
  res.render('managecities', {
    u: _,
    user: req.user,
    isMasterAccount: isMasterAccount(req.user)
  });
};

definition.authget['/managelocations'] = function(req, res) {
  res.render('managelocations', {
    u: _,
    user: req.user,
    isMasterAccount: isMasterAccount(req.user)
  });
};

definition.authget['/viewhistory'] = function(req, res) {
  res.render('viewhistory', { user: req.user });
};

definition.authget['/cities'] = function(req, res) {
  cities.getall(function(err, data) {
    res.json(data || { });
  });
};

definition.get['/accessdenied'] = function(req, res) {
  cities.getall(function(err, data) {
    res.render('accessdenied', {
      user: req.user,
      masterAccount: env.twitterMasterAccount
    });
  });
};

definition.get['/cities/:tinyname'] = function(req, res) {
  allCities(function(all) {
    var filteredHash = { }

    _.each(all, function(k) {
      if(k.tinyname == req.params.tinyname) {
        filteredHash[k.id] = k;
      }
    });

    res.render('city', { u: _, user: req.user, all: filteredHash });
  });
};

///////////
//api gets
///////////
definition.get['/all'] = function (req, res) {
  allCities(function(all) {
    res.json(all);
  });
};

definition.get['/city'] = function (req, res) {
  cities.get(req.query.id, function(err, data) {
    res.json(data || { });
  });
};

definition.get['/history'] = function(req, res) {
  history.getall(function(err, allHistory) {
    res.json(_.sortBy(allHistory || { }, function(h) {
      return -1 * new Date(h.audit.date).getTime();
    }));
  });
};

definition.get['/locations'] = function(req, res) {
  locations.getall(function(err, data) {
    var filtered = data || { };
    res.json(_.filter(data, function(d) {
      return d.cityId == (req.query.id || d.cityId);
    }));
  });
};

////////////
//api posts
////////////
definition.post['/city'] = function (req, res) {
  if(!isMasterAccount(req.user)) {
    res.send(403);
  } else if(!req.body.city && !req.body.country) {
    res.json({ });
  } else {
    req.body.id = req.body.id || uuid.v1();

    history.set({
      id: uuid.v1(),
      audit: {
        type: "cityentry",
        by: req.user,
        date: new Date()
      },
      details: req.body
    });

    cities.set(req.body, function() {
      res.json({ });
    });
  }
};

definition.post['/deletecity'] = function(req, res) {
  if(!isMasterAccount(req.user)) {
    res.send(403);
  } else if(!req.body.city && !req.body.country) {
    res.json({ });
  } else {
    req.body.id = req.body.id || uuid.v1();

    history.set({
      id: uuid.v1(),
      audit: {
        type: "citydelete",
        by: req.user,
        date: new Date()
      },
      details: req.body
    });

    cities.del(req.body.id, function() {
      res.json({ });
    });
  }
};

definition.authpost['/location'] = function (req, res) {
  var googleMapsApiKey = env.googleMapsApiKey;
  var latLongUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(req.body.address) + "&sensor=false&api_key=" + googleMapsApiKey;

  httpRequest(latLongUrl, function(err, response, data) {
    var data = JSON.parse(data);
    if(data.results.length) {
      var lat = data.results[0].geometry.location.lat;
      var lng = data.results[0].geometry.location.lng;
      var formattedAddress = data.results[0].formatted_address;
      req.body.lat = lat;
      req.body.lng = lng;
    }

    req.body.id = req.body.id || uuid.v1();

    history.set({
      id: uuid.v1(),
      audit: {
        type: "locationentry",
        by: req.user,
        date: new Date()
      },
      details: req.body
    });

    locations.set(req.body, function() {
      res.json(req.body);
    });
  });
};

definition.authpost['/deletelocation'] = function (req, res) {
  history.set({
    id: uuid.v1(),
    audit: {
      type: "locationdelete",
      by: req.user,
      date: new Date()
    },
    details: req.body
  });

  locations.del(req.body.id, function() {
    res.json({ });
  });
};


module.exports.definition = definition;
