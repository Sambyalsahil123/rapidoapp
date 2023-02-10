/* eslint-disable max-len */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
// admin.initializeApp();
const firestore = admin.firestore();

const kDistanceRadiusForDispatchInMiles = 50;

/*
 ** Dispatch new trip drivers
 */
exports.dispatch = functions.firestore
    .document("taxi_trips/{tripID}")
    .onWrite((change, context) => {
      functions.logger.log(change, "THIS IS CHANGE ");
      functions.logger.log(
          change.after,
          "CHANGE AFTER FEFAEFEFEr",
      );
      functions.logger.log(change.after.data(), "HERE IS DATA");

      const orderData = change.after.data();
      functions.logger.log(orderData, "ORDER DATAAAA");
      if (!orderData) {
        functions.logger.log("No trip data");
        return;
      }

      if (orderData.status === "passenger_cancelled") {
        functions.logger.log("Order #" + change.after.ref.id + " was cancelled.");
        return null;
      }

      if (
        orderData.status === "awaiting_driver" ||
      orderData.status === "driver_rejected"
      ) {
      // we need to find an available driver
        functions.logger.log(
            "Finding a driver for order #" + change.after.ref.id,
        );

        const rejectedByDrivers = orderData.rejectedByDrivers ?
        orderData.rejectedByDrivers :
        [];

        // change.after.ref.set({ status: "Pending Driver" }, {merge: true})
        return firestore
            .collection("users")
            // .where("role", "==", "driver")
            .where("isActive", "==", true)
            // .where("carType", "==", orderData.carType)
            .get()
            .then((snapshot) => {
              functions.logger.log(
                  snapshot,
                  "?|?|?|?|?|?|?|?|?| UNDER THE SNAPSHOT",
              );
              let found = false;
              snapshot.forEach((doc) => {
                functions.logger.log(
                    doc,
                    "UNDER THE DOC ||?|??||?|?|?|?||??|?|?|?|??|",
                );
                if (!found) {
                  // We simply assign the first available driver who's within a reasonable distance from the passenger and who did not reject the order
                  const driver = doc.data();
                  functions.logger.log(driver, "UNDER DRIVERRRRRR_____________");

                  if (
                    driver.location &&
                rejectedByDrivers.indexOf(driver.id) === -1 &&
                (driver.inProgressOrderID === undefined ||
                  driver.inProgressOrderID === null) &&
                (driver.orderRequestData === undefined ||
                  driver.orderRequestData === null)
                  ) {
                    const pickup = orderData.pickup;
                    functions.logger.log(
                        pickup,
                        "PICKKKKKKKKKKKKKKKKK<><><><><><><><><><><><><><><><>~~~~~~~~~~~~>~>~>>~~>~>~>~>~>~>~~>~",
                    );
                    if (pickup) {
                      const distance = distanceRadius(
                          driver.location.latitude,
                          driver.location.longitude,
                          pickup.latitude,
                          pickup.longitude,
                      );
                      functions.logger.log(
                          "Driver (" + driver.email + " Location: ",
                      );
                      functions.logger.log(
                          driver.location,
                          "this is driver location ",
                      );
                      functions.logger.log(
                          "pickup Location: lat " +
                      pickup.latitude +
                      " long" +
                      pickup.latitude,
                      );
                      functions.logger.log(
                          distance,
                          "DISTANCE)()()()()()()()(()()((())()()()()()()()())(&*&*&*^%&^$%E%D$#D%$E$^%^UY",
                      );
                      functions.logger.log(
                          driver.id,
                          "%^%^%^%^%^^%^%^%^%^%^%^%^%^%^%^%^%^%",
                      );

                      if (distance < kDistanceRadiusForDispatchInMiles) {
                        found = true;
                        functions.logger.log(
                            driver.id,
                            "{}{}{}{}{}{}{}{}{+++++}}iddriver.id",
                        );
                        // We send the order to the driver, by appending orderRequestData to the driver's user model in the users table
                        firestore.collection("users").doc(driver.id).update({
                          orderRequestData: orderData,
                        });

                        functions.logger.log(
                            driver.id,
                            "<<<<<<<<<<DRIVER ID ()()()()()()()()@@@@@@@@",
                        );
                        functions.logger.log(orderData, "ORDER DATA>");

                        functions.logger.log(
                            "Order sent to driver #" +
                        driver.id +
                        " for order #" +
                        change.after.ref.id +
                        " with distance at " +
                        distance,
                        );
                      }
                    }
                  }
                }
              });
              if (!found) {
                // We did not find an available driver
                functions.logger.log(
                    "||||||||Could not find an available driver for order #|||||||" +
                change.after.ref.id,
                );
                change.after.ref.set(
                    {status: "no_driver_found"},
                    {merge: true},
                );
              }
              return null;
            })
            .catch((error) => {
              functions.logger.log(error, "catch+_+_+_+_+_+_+errrrrr");
            });
      }

      return null;
    });

const distanceRadius = (lat1, lon1, lat2, lon2) => {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  } else {
    const radlat1 = (Math.PI * lat1) / 180;
    const radlat2 = (Math.PI * lat2) / 180;
    const theta = lon1 - lon2;
    const radtheta = (Math.PI * theta) / 180;
    let dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    return dist;
  }
};
