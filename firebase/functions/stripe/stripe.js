const functions = require('firebase-functions')

const stripe = require('stripe')(functions.config().stripe.test_key)

exports.makeStripePayment = functions.https.onCall(async (data, context) => {
  const { amount, currency } = data
  console.log(amount, currency)
  return new Promise(function (resolve, reject) {
    stripe.paymentIntents.create(
      {
        amount: amount,
        currency: currency,
      },
      (err, paymentIntent) => {
        if (err) {
          console.log(err)
          resolve({ success: false })
        }
        const result = {
          clientSecret: paymentIntent.client_secret,
          success: true,
        }
        console.log(result)
        resolve(result)
      },
    )
  })
})
