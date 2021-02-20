const redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient();

client.on('error', (error) => {
  console.error(error);
});

const zadd = promisify(client.zadd).bind(client);
const zrevrange = promisify(client.zrevrange).bind(client);
const exists = promisify(client.exists).bind(client);
const expire = promisify(client.expire).bind(client);
const zincrby = promisify(client.zincrby).bind(client);

module.exports = {
  zadd, zrevrange, exists, expire, zincrby,
};
