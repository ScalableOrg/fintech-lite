const crypto = require('crypto');

const key = 'mysecret key';

// create hahs
// const hash = crypto.createHmac('sha512', key);
// hash.update(text);
// const value = hash.digest('hex');

// print result
// console.log(value);

function hashArguments(...parameters) {
  const concatenatedRequest = parameters.join('');
  const hash = crypto.createHmac('sha512', key);
  hash.update(concatenatedRequest);
  return hash.digest('hex');
}

module.exports = { hashArguments };
