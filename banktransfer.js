const models = require('./models');
const {
  exists, zrevrange, zadd, expire, zincrby,
} = require('./redis');

function processResult(amount) {
  if (amount === 10) {
    return {
      success: false,
      error: 'Bank transfer failed',
    };
  }
  return {
    success: true,
    message: 'Transfer was successful',
  };
}

const BANK_TRANSFER_PROCESSORS_SET_NAME = 'banktf_processors_list';

// function that calls paystack endpoint
function paystackBT(amount) {
  return processResult(amount);
}

// function that calls flutterwave endpoint
function flutterwaveBT(amount) {
  return processResult(amount);
}

// function that calls monnify endpoint
function monnifyBT(amount) {
  return processResult(amount);
}

// general function that calls processor function based on processor
function processBankTransfer(processor, amount) {
  if (processor === 'paystack') {
    return paystackBT(amount);
  }
  if (processor === 'flutterwave') {
    return flutterwaveBT(amount);
  }
  if (processor === 'monnify') {
    return monnifyBT(amount);
  }
}

// main function
async function transferToBank(amount) {
  const processors = await models.bank_transfer_processors.find(
    { where: { enabled: true }, raw: true },
  );
  const setArray = [];
  const setExists = await exists(BANK_TRANSFER_PROCESSORS_SET_NAME);

  if (!setExists) {
    processors.forEach((processor) => {
      let score = 0;
      if (processor.position === 1) {
        score = 30;
      }
      if (processor.position === 2) {
        score = 10;
      }
      setArray.push(score);
      setArray.push(processor.name);
    });
    await zadd(BANK_TRANSFER_PROCESSORS_SET_NAME, setArray);
    await expire(BANK_TRANSFER_PROCESSORS_SET_NAME, 1800); // set should refresh in 30mins
  }
  const processorList = await zrevrange(BANK_TRANSFER_PROCESSORS_SET_NAME, 0, -1, 'WITHSCORES');

  const [highestScoredProcessor] = processorList;

  const bankTransferResult = processBankTransfer(highestScoredProcessor, amount);
  if (!bankTransferResult.success) {
    await zincrby(BANK_TRANSFER_PROCESSORS_SET_NAME, -10, highestScoredProcessor);
  } else {
    await zincrby(BANK_TRANSFER_PROCESSORS_SET_NAME, 10, highestScoredProcessor);
  }
  return bankTransferResult;
}

// await trasferToBank(10);
