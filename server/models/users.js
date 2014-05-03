var redis = require('./redisWrap');

module.exports.set = redis.hset("users");
module.exports.get = redis.hget("users");
