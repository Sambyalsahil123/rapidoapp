const functions = require('firebase-functions');
const braintree = require('braintree');

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: 'YOUR_MERCHANT_ID',
  publicKey: 'YOUR_PUBLIC_KEY',
  privateKey: 'YOUR_PRIVATE_KEY',
});

exports.createToken = functions.https.onCall((data, context) => {
  gateway.clientToken.generate({}, (err, response) => {
    if (err) {
      return { success: false };
    }
    return { clientToken: response.clientToken, success: true };
  });
});

exports.checkout = functions.https.onCall((data, context) => {
  const { nonceFromTheClient, amountFromClient } = data;
  gateway.transaction.sale(
    {
      amount: amountFromClient,
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true,
      },
    },
    (err, result) => {
      if (err) {
        return { success: false };
      }
      return result;
    },
  );
});
