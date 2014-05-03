var redis = require('./redisWrap');

module.exports.set = redis.hset("locations");
module.exports.get = redis.hget("locations");
module.exports.getall = redis.hgetall("locations");
