const axios = require('axios').default;
const dotenv = require('dotenv');
const { creditAccount } = require('./helpers/transactions');
const models = require('./models');

dotenv.config();

const PAYSTACK_BASE_URL = 'https://api.paystack.co/charge';

function processInitialCardCharge(chargeResult) {
  if (chargeResult.data.status === 'success') {
    return {
      success: true,
      message: chargeResult.data.status,
      data: {
        shouldCreditAccount: true,

      },
    };
  }

  return {
    success: true,
    message: chargeResult.data.status,
    data: {
      shouldCreditAccount: false,
      reference: chargeResult.data.reference,
    },
  };
}

async function completeSuccessfulCharge({ accountId, reference, amount }) {
  await models.card_transactions.update({ last_response: 'success' }, { where: { external_reference: reference } });
  const t = await models.sequelize.transaction();
  const creditResult = await creditAccount({
    account_id: accountId,
    amount,
    purpose: 'card_funding',
    t,
    metadata: {
      external_reference: reference,
    },
  });
  if (!creditResult.success) {
    await t.rollback();
    return {
      success: false,
      error: creditResult.error,
    };
  }
  await t.commit();
  return {
    success: true,
    message: 'Account successfully credited',
  };
}
async function chargeCard({
  accountId, pan, expiry_month, expiry_year, cvv, email, amount,
}) {
  try {
    const charge = await axios.post(PAYSTACK_BASE_URL, {
      card: {
        number: pan,
        cvv,
        expiry_year,
        expiry_month,
      },
      email,
      amount,
    }, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const nextAction = processInitialCardCharge(charge.data);
    await models.card_transactions.create({
      external_reference: nextAction.data.reference,
      amount,
      account_id: accountId,
      last_response: nextAction.success ? nextAction.message : nextAction.error,
    });
    if (!nextAction.success) {
      return {
        success: nextAction.success,
        error: nextAction.error,
      };
    }
    const t = await models.sequelize.transaction();
    try {
      if (nextAction.data.shouldCreditAccount) {
        const creditResult = await creditAccount({
          amount,
          account_id: accountId,
          purpose: 'card_funding',
          metadata: {
            external_reference: nextAction.data.reference,
          },
          t,
        });
        if (!creditResult.success) {
          await t.rollback();
          return {
            success: false,
            error: creditResult.error,
          };
        }
        await t.commit();
        return {
          success: true,
          message: 'Charge successful',
        };
      }
      return nextAction;
    } catch (error) {
      t.rollback();
      return {
        success: false,
        error,
      };
    }
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    return error;
  }
}

async function submitPin({
  reference, pin,
}) {
  try {
    const transaction = await models.card_transactions.findOne({
      where: { external_reference: reference },
    });
    if (!transaction) {
      return {
        success: false,
        error: 'Transaction not found',
      };
    }
    if (transaction.last_response === 'success') {
      return {
        success: false,
        error: 'Transaction already succeeded',
      };
    }
    const charge = await axios.post(`${PAYSTACK_BASE_URL}/submit_pin`, {
      reference, pin,
    }, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });
    if (charge.data.data.status === 'success') {
      await completeSuccessfulCharge({
        accountId: transaction.account_id,
        reference,
        amount: Number(transaction.amount),
      });
      return {
        success: true,
        message: 'Charge successful',
        shouldCreditAccount: true,
      };
    }
    await models.card_transactions.update(
      { last_response: charge.data.data.status },
      { where: { external_reference: reference } },
    );

    return {
      success: true,
      message: charge.data.data.message,
      data: {
        shouldCreditAccount: false,
        reference,
      },
    };
  } catch (error) {
    return error.response ? error.response.data : error;
  }
}

async function submitOtp({
  reference, otp,
}) {
  try {
    const transaction = await models.card_transactions.findOne({
      where: { external_reference: reference },
    });
    if (!transaction) {
      return {
        success: false,
        error: 'Transaction not found',
      };
    }
    if (transaction.last_response === 'success') {
      return {
        success: false,
        error: 'Transaction already succeeded',
      };
    }
    const charge = await axios.post(`${PAYSTACK_BASE_URL}/submit_otp`, {
      reference, otp,
    }, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    if (charge.data.data.status === 'success') {
      await completeSuccessfulCharge({
        accountId: transaction.account_id,
        reference,
        amount: transaction.amount,
      });
      return {
        success: true,
        message: 'Charge successful',
        shouldCreditAccount: true,
      };
    }
    await models.card_transactions.update(
      { last_response: charge.data.data.status },
      { where: { external_reference: reference } },
    );

    return {
      success: true,
      message: charge.data.data.message,
      data: {
        shouldCreditAccount: false,
        reference,
      },
    };
  } catch (error) {
    return error.response ? error.response.data : error;
  }
}

async function submitPhone({
  reference, phone,
}) {
  try {
    const transaction = await models.card_transactions.findOne({
      where: { external_reference: reference },
    });
    if (!transaction) {
      return {
        success: false,
        error: 'Transaction not found',
      };
    }
    if (transaction.last_response === 'success') {
      return {
        success: false,
        error: 'Transaction already succeeded',
      };
    }
    const charge = await axios.post(`${PAYSTACK_BASE_URL}/submit_phone`, {
      reference, phone,
    }, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    if (charge.data.data.status === 'success') {
      await completeSuccessfulCharge({
        accountId: transaction.account_id,
        reference,
        amount: transaction.amount,
      });
      return {
        success: true,
        message: 'Charge successful',
        shouldCreditAccount: true,
      };
    }
    await models.card_transactions.update(
      { last_response: charge.data.data.status },
      { where: { external_reference: reference } },
    );

    return {
      success: true,
      message: charge.data.data.message,
      data: {
        shouldCreditAccount: false,
        reference,
      },
    };
  } catch (error) {
    return error.response ? error.response.data : error;
  }
}
