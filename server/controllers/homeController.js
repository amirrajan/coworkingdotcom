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

///////
//views
///////
definition.get['/'] = function(req, res) {
  res.render('index', { u: _, user: req.user });
};

definition.get['/logout'] = function(req, res){
  req.logout();
  res.redirect('/');
};

definition.authget['/managecities'] = function(req, res) {
  res.render('managecities', { u: _, user: req.user });
};

definition.authget['/managelocations'] = function(req, res) {
  res.render('managelocations', { u: _, user: req.user });
};

definition.authget['/viewhistory'] = function(req, res) {
  res.render('viewhistory', { user: req.user });
};

definition.authget['/cities'] = function(req, res) {
  cities.getall(function(err, data) {
    res.json(data || { });
  });
};

///////////
//api gets
///////////
definition.get['/all'] = function (req, res) {
  cities.getall(function(err, allCities) {
    locations.getall(function(err, allLocations) {
      _.each(allCities, function(city) {
        city.locations = [];
      });

      _.each(allLocations, function(loc) {
        allCities[loc.cityId].locations.push(loc);
      });

      res.json(allCities);
    });
  });
};

definition.get['/city'] = function (req, res) {
  cities.get(req.query.id, function(err, data) {
    res.json(data || { });
  });
};

definition.get['/history'] = function(req, res) {
  history.getall(function(err, allHistory) {
    res.json(allHistory || { });
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
definition.authpost['/city'] = function (req, res) {
  if(!req.body.city && !req.body.country) {
    res.json({ });
  } else {
    req.body.id = req.body.id || uuid.v1();

    history.set({
      id: uuid.v1(),
      audit: {
        type: "cityentry",
        by: req.user
      },
      details: req.body
    });

    cities.set(req.body, function() {
      res.json({ });
    });
  }
};

definition.authpost['/location'] = function (req, res) {
  var googleMapsKey = env.googleMapsApiKey;
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
        by: req.user
      },
      details: req.body
    });

    locations.set(req.body, function() {
      res.json(req.body);
    });
  });
};


module.exports.definition = definition;
