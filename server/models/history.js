var redis = require('./redisWrap');

module.exports.set = redis.hset("history");
module.exports.get = redis.hget("history");
module.exports.getall = redis.hgetall("history");
