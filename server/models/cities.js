var redis = require('./redisWrap');

module.exports.set = redis.hset("cities");
module.exports.get = redis.hget("cities");
module.exports.getall = redis.hgetall("cities");
module.exports.del = redis.hdel("cities");
