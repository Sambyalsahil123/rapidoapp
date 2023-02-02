/* eslint-disable quote-props */
/* eslint-disable indent */
/* eslint-disable max-len */
const functions = require("firebase-functions");

const admin = require("firebase-admin");
// const collectionsUtils = require("../../CloudFunctions/functions/core/collections");
// const {getDoc} = collectionsUtils;
// const db = admin.firestore();

admin.initializeApp();
const axios = require("axios");

const FAST_2_SMS_KEY =
  "LoyxFDqUBuRn2IVhfAN4HWpPgkibO3KcrlsdJeQTGm790z8CtvmlYVW6voSe7bpKuLJ31RZdhIfH5MyF";

const database = admin.firestore();

const OTPRef = database.collection("otpCollection");

const userRef = database.collection("users");

// const notificationsRef = database.collection("notifications");

// Check if user already exists
exports.isUserExists = functions.https.onRequest(async (request, response) => {
  const data = request.body;

  try {
    const user = await userRef
      .where("phoneNumber", "==", Number(data.phoneNumber))
      .get();

    if (user.docs.length) {
      const message =
        "User with this number is already exists please sign up with different number!";
      throw new Error(message);
    }
    response.json({success: true});
  } catch (error) {
    response.json({success: false, error: error.message || error});
  }
});

// // FOR SEND OTP
exports.sendOTP = functions.https.onRequest(async (request, response) => {
  const generatedOTP = Math.floor(1000 + Math.random() * 9000);

  const data = request.body;

  try {
    const user = await userRef
      .where("phoneNumber", "==", Number(data.phoneNumber))
      .get();

    if (user.docs.length) {
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
    let userData;
    let user;
    if (isFromLoginPage) {
      user = await userRef.where("phoneNumber", "==", data.phoneNumber).get();
      userData = {...user?.docs[0]?.data(), id: user?.docs[0]?.id};
    }

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
    console.log("HELLO");
    if (otpCollection?.docs?.length > 0) {
      if (!isFromLoginPage) {
        await userRef.add({...data});
        response.json({success: true, userData});
        return;
      } else {
        response.json({success: true, userData});
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
      const message = "User can't found, Please signup first";
      throw new Error(message);
    }

    const userData = user.docs[0].data();
    const notApproved = userData.IsApproved === false;

    // functions.logger.log(userData, notApproved, "userData asdfasdfads");

    if (notApproved) {
      const message = "Your account is under review";
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
        // timestamp: new Date(),
      });

      response.json({success: true});
    }
  } catch (error) {
    response.json({success: false, error: error.message || error});
  }
});
// ///////// FOR CUSTOMER ONBOARDING

const customerRef = database.collection("customers");

// Check if user already exists
exports.isCustomerExists = functions.https.onRequest(
  async (request, response) => {
    const data = request.body;

    try {
      const user = await customerRef
        .where("contactNumber", "==", Number(data.contactNumber))
        .get();

      if (user.docs.length) {
        const message =
          "User with this number is already exists please sign up with different number!";
        throw new Error(message);
      }
      response.json({success: true});
    } catch (error) {
      response.json({success: false, error: error.message || error});
    }
  },
);

// // FOR SEND OTP
exports.sendOTPforCustomer = functions.https.onRequest(
  async (request, response) => {
    const generatedOTP = Math.floor(1000 + Math.random() * 9000);

    const data = request.body;

    try {
      const user = await customerRef
        .where("contactNumber", "==", Number(data.contactNumber))
        .get();

      if (user.docs.length) {
        const message =
          "User with this number is already exists please sign up with different number!";
        throw new Error(message);
      }

      await axios.post(
        "https://www.fast2sms.com/dev/bulkV2",
        {
          variables_values: generatedOTP,
          route: "otp",
          numbers: `${data.contactNumber}`,
        },
        {
          headers: {
            authorization: FAST_2_SMS_KEY,
            "Content-Type": "application/json",
          },
        },
      );

      await OTPRef.add({
        contactNumber: data.contactNumber,
        otp: generatedOTP,
      });
      response.json({success: true});
    } catch (error) {
      response.json({success: false, error: error.message || error});
    }
  },
);

// //// FOR OTP CONFIRMATION

exports.confirmOTPforCustomer = functions.https.onRequest(
  async (request, response) => {
    const data = request.body;
    const isFromLoginPage = data?.isFromLoginPage;

    try {
      let userData;
      let user;
      if (isFromLoginPage) {
        user = await customerRef
          .where("contactNumber", "==", data.contactNumber)
          .get();
        userData = {...user?.docs[0]?.data(), id: user?.docs[0]?.id};
      }

      const otpCollection = await OTPRef.where(
        "contactNumber",
        "==",
        data.contactNumber,
      )
        .where("otp", "==", data.otp)
        .get();

      if (otpCollection?.docs?.length > 0) {
        if (!isFromLoginPage) {
          await customerRef.add({...data});
          response.json({success: true, userData});
          return;
        } else {
          response.json({success: true, userData});
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
  },
);

// ////// FOR LOGIN OTP
exports.loginAsCustomer = functions.https.onRequest(
  async (request, response) => {
    const data = request.body;
    const generatedOTP = Math.floor(1000 + Math.random() * 9000);

    try {
      const user = await customerRef
        .where("contactNumber", "==", data.contactNumber)
        .get();

      if (user.docs.length <= 0) {
        const message = "User can't found, Please signup first";
        throw new Error(message);
      }

      const userData = user.docs[0].data();
      const notApproved = userData.IsApproved === false;

      // functions.logger.log(userData, notApproved, "userData asdfasdfads");

      if (notApproved) {
        const message = "Your account is under review";
        throw new Error(message);
      }

      if (user.docs.length > 0) {
        await axios.post(
          "https://www.fast2sms.com/dev/bulkV2",
          {
            variables_values: generatedOTP,
            route: "otp",
            numbers: `${data.contactNumber}`,
          },
          {
            headers: {
              authorization: FAST_2_SMS_KEY,
              "Content-Type": "application/json",
            },
          },
        );

        await OTPRef.add({
          contactNumber: data.contactNumber,
          otp: generatedOTP,
          // timestamp: new Date(),
        });

        response.json({success: true});
      }
    } catch (error) {
      response.json({success: false, error: error.message || error});
    }
  },
);

// ///DELETE OTP DATA FROM FIRESTORE AFTER 15 MINUTES

// exports.deleteAfter15Minutes = functions.firestore
//   .document("otpCollection")
//   .onCreate(async (snap, context) => {
//     // Set the document to be deleted 15 minutes after it is created

//     // const deleteAfter = new Date(
//     //   snap.createTime.toDate().getTime() + 15 * 60 * 1000,
//     // );

//     // Schedule the document to be deleted
//     try {
//       await db
//         .runTransaction(async (transaction) => {
//           const doc = await transaction.get(snap.ref);
//           if (doc.exists) {
//             transaction.delete(snap.ref);
//           }
//         });
//       console.log(`Document ${context.params.docId} scheduled for deletion.`);
//       return null;
//     } catch (err) {
//       console.error(`Error scheduling document for deletion: ${err}`);
//       return null;
//     }
//   });

// ///// OR

// exports.deleteOldOtp = functions.pubsub.schedule("every 15 minutes").onRun((context) => {
//   // Get a reference to the Firestore collection
//   const collectionRef = admin.firestore().collection("otpCollection");

//     // Create a date for 15 minutes ago
//     const fifteenMinutesAgo = new Date();
//     fifteenMinutesAgo.setMinutes(fifteenMinutesAgo.getMinutes() - 15);

//     // Delete any documents with a timestamp earlier than 15 minutes ago
//     return collectionRef.where("timestamp", "<", fifteenMinutesAgo).delete();
//   });

// exports.updateNotification = functions.https.onCall(async (data, context) => {
//   const {notificationID, userID} = data;
//   console.log(`Updating notifcation ${JSON.stringify(data)} `);
//   if (notificationID) {
//     const doc = await getDoc(
//       notificationsRef.doc(userID),
//       "notifications",
//       notificationID,
//     );
//     console.log(doc);
//     if (doc?.ref) {
//       doc.ref.set({seen: true}, {merge: true});
//     }
//   }
// });
