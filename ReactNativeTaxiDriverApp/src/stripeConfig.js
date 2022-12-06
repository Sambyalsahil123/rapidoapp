const stripeConfig = {
  PUBLISHABLE_KEY:
    'pk_test_51Ifl3jFrWOr9lMSK0AAR0DBI5veAeYhrpezBF0WrHB6GHTstLxBlu3SFQRaw2aAVlk0mMtgdpFtursJzFzcrxYXE002EjvLVn8', // "pk_test_..." in test mode and ""pk_live_..."" in live mode
  MERCHANT_ID: 'merchant.com.{{YOUR_APP_NAME}}',
  ANDROID_PAYMENT_MODE: 'test', // test || production
}

export default stripeConfig
