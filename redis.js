const redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient();

client.on('error', (error) => {
  console.error(error);
});

const addElement = promisify(client.sadd).bind(client);
const expireElement = promisify(client.expire).bind(client);

async function checkRedisHash(accountId, hash) {
  const response = await addElement(accountId, hash);
  if (!response) {
    return {
      success: false,
      error: 'Duplicate transaction',
    };
  }
  await expireElement(accountId, 30);
  return { success: true };
}

module.exports = { checkRedisHash };
