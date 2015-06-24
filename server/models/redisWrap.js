var redis = require("redis");
var client = null;

if(process.env.REDISTOGO_URL) { //heroku
  var rtg   = require("url").parse(process.env.REDISTOGO_URL);
  var client = require("redis").createClient(rtg.port, rtg.hostname);
  client.auth(rtg.auth.split(":")[1]);
} else {
  client = redis.createClient();
}

module.exports.client = client;

module.exports.hset = function(collection) {
  return function(obj, callback) {
    client.hset(collection, obj.id, JSON.stringify(obj), function(err) {
      if(callback) callback(err, obj);
    });
  }
};

module.exports.hget = function(collection) {
  return function (id, callback) {
    client.hget(collection, id, function(err, obj) {
      if(callback) callback(err, JSON.parse(obj));
    });
  }
};

module.exports.hdel = function(collection) {
  return function (id, callback) {
    client.hdel(collection, id, function(err, obj) {
      if(callback) callback(err);
    });
  }
};

module.exports.hgetall = function(collection) {
  return function (callback) {
    client.hgetall(collection, function(err, obj) {
      for(var i in obj) {
        obj[i] = JSON.parse(obj[i]);
      }

      if(callback) callback(err, obj);
    });
  }
};
