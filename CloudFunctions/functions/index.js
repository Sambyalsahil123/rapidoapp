/* eslint-disable quote-props */
/* eslint-disable indent */
/* eslint-disable max-len */
const functions = require("firebase-functions");

const admin = require("firebase-admin");

admin.initializeApp();

const axios = require("axios");

const FAST_2_SMS_KEY =
  "LoyxFDqUBuRn2IVhfAN4HWpPgkibO3KcrlsdJeQTGm790z8CtvmlYVW6voSe7bpKuLJ31RZdhIfH5MyF";

const database = admin.firestore();

const OTPRef = database.collection("otpCollection");

const userRef = database.collection("users");

// // FOR SEND OTP
exports.sendOTP = functions.https.onRequest(async (request, response) => {
  const generatedOTP = Math.floor(1000 + Math.random() * 9000);

  const data = request.body;

  try {
    const user = await userRef
      .where("phoneNumber", "==", Number(data.phoneNumber))
      .get();

    if (user.docs.length > 0) {
      const message =
        "User with this number is already exists please sign up with different number!";
      throw new Error(message);
    }

    await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        variables_values: generatedOTP,
        route: "otp",
        numbers: `${data.phoneNumber}`,
      },
      {
        headers: {
          authorization: FAST_2_SMS_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    await OTPRef.add({
      phoneNumber: data.phoneNumber,
      otp: generatedOTP,
    });
    response.json({success: true});
  } catch (error) {
    response.json({success: false, error: error.message || error});
  }
});

// //// FOR OTP CONFIRMATION

exports.confirmOTP = functions.https.onRequest(async (request, response) => {
  const data = request.body;
  const isFromLoginPage = data?.isFromLoginPage;

  try {
    const otpCollection = await OTPRef.where(
      "phoneNumber",
      "==",
      data.phoneNumber,
    )
      .where("otp", "==", data.otp)
      .get();

    // functions.logger.log(
    //   "new",
    //   data,
    //   typeof data.phoneNumber,
    //   typeof data.otp,
    //   otpCollection.docs,
    //   otpCollection.docs.length,
    // );
    // functions.logger.log("new22======>", data.phoneNumber, data.phoneNumber);

    if (otpCollection?.docs?.length > 0) {
      if (!isFromLoginPage) {
        await userRef.add({...data});
        response.json({success: true});
        return;
      } else {
        response.json({success: true});
        return;
      }
    } else {
      const message = "Wrong OTP";
      throw new Error(message);
    }

    // if (otpCollection?.docs?.length > 0 && isFromLoginPage) {
    //   functions.logger.log("NOT 898989898998 Sending Response -====-=========>");
    //   response.json({success: true});
    // }
  } catch (error) {
    response.json({success: false, error: error.message || error});
    // response.json({success: false, error: (error.message || error)});
  }
});

// ////// FOR LOGIN OTP
exports.login = functions.https.onRequest(async (request, response) => {
  const data = request.body;
  const generatedOTP = Math.floor(1000 + Math.random() * 9000);

  try {
    const user = await userRef
      .where("phoneNumber", "==", data.phoneNumber)
      .get();
    if (user.docs.length <= 0) {
      const message = "user doesn't exist, please signup first";
      throw new Error(message);
    }

    if (user.docs.length > 0) {
      await axios.post(
        "https://www.fast2sms.com/dev/bulkV2",
        {
          variables_values: generatedOTP,
          route: "otp",
          numbers: `${data.phoneNumber}`,
        },
        {
          headers: {
            authorization: FAST_2_SMS_KEY,
            "Content-Type": "application/json",
          },
        },
      );

      await OTPRef.add({
        phoneNumber: data.phoneNumber,
        otp: generatedOTP,
      });

      response.json({success: true});
    }
  } catch (error) {
    response.json({success: false, error: error.message || error});
  }
});
