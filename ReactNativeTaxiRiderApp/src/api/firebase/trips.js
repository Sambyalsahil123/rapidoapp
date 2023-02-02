import { firebase } from '../../Core/api/firebase/config'

const tripRef = firebase.firestore().collection('taxi_trips')
const carCategoriesRef = firebase.firestore().collection('taxi_car_categories')
const usersRef = firebase.firestore().collection('customers')
const driversRef = firebase.firestore().collection('users')

// const createTrip = async trip => {
//   console.log(trip, 'this is trip DATA')
//   return new Promise(resolve => {
//     const tripId = tripRef.doc().id
//     // const tripId = "FNFxkdSKQwJs9c5dgpd5"
//     let _trip = {}
//     Object.keys(trip).map(key => {
//       if (trip  [key]) {
//         Object.assign(_trip, { [key]: trip[key] })
//       }
//     })
//     console.log(tripId, 'TRIP ID ')
//     console.log(driversRef, 'driversRefdriversRef')
//     // tripRef
//     //   .doc(tripId)
//     //   .set({ ..._trip, id: tripId }, { merge: true })
//     //   .then(res => {
//     //     console.log(res, '<<<<<<resresres')
//     //     resolve(tripId)
//     //     usersRef
//     //       .doc(_trip?.passenger?.id || '')
//     //       .update({ inProgressOrderID: tripId })
//     //   })
//     //   .catch(err => {
//     //     console.log(err, '<<<<<<errerrerr')

//     //     resolve()
//     //   })
//     tripRef
//     .doc(tripId)
//     .set({ ..._trip, id: tripId }, { merge: true })
//     .then(res => {
//       console.log(res, '<<<<<<resresres')
//       console.log(_trip,"=->>>>>>_trip")
//       resolve(tripId)
//       usersRef
//         .doc(_trip?.passenger?.id || '')
//         .update({ inProgressOrderID: tripId })
//     })
//     .catch(err => {
//       console.log(err, '<<<<<<errerrerr')

//       resolve()
//     })
//   })
// }

const createTrip = async trip => {
  console.log(trip,"=+->>>>trip")
  return new Promise(resolve => {
    const tripId = tripRef.doc().id
    console.log(tripId,"=>>>>tripidd")
    tripRef.doc(tripId).set({ ...trip, id: tripId }, { merge: true })
      .then(() => {
        console.log("resesee")
        resolve(tripId)
        driversRef.doc(trip.passenger.id).update({ inProgressOrderID: tripId })
      })
      .catch(() => resolve())
  })
}

const updateTrip = (tripId, trip) => {
  console.log(trip, tripId, 'THIS IS TRIP ID OR DATA >>>> UPDATETRIP')
  return new Promise(resolve => {
    if (tripId && trip) {
      return tripRef
        .doc(tripId)
        .set(trip, { merge: true })
        .then(() => {
          resolve(tripId)
        })
        .catch(() => resolve())
    }
    resolve()
  })
}

const cancelTrip = trip => {
  console.log(cancelTrip, 'TRIP_CANCEL')

  if (trip?.id) {
    updateTrip(trip.id, { status: 'passenger_cancelled' })
  }
  if (trip.driver?.id) {
    usersRef
      .doc(trip.driver.id)
      .set({ inProgressOrderID: null, orderRequestData: null }, { merge: true })
  }

  if (trip.passenger?.id) {
    usersRef
      .doc(trip.passenger.id)
      .set({ inProgressOrderID: null }, { merge: true })
  }
}

const getTrip = tripId => {
  console.log(tripId, 'this is getTrip')
  return new Promise(resolve => {
    if (tripId) {
      return tripRef
        .doc(tripId)
        .get()
        .then(doc => {
          resolve(doc.data())
        })
        .catch(() => resolve())
    }
    resolve()
  })
}

const getCarCategories = () => {
  console.log('getCArCategories')

  return new Promise(resolve => {
    return carCategoriesRef
      .get()
      .then(snapshots => {
        const data = snapshots.docs.map(doc => doc.data())
        resolve(data)
      })
      .catch(() => resolve())
  })
}

const setCarCategories = (carCategoryId, category) => {
  console.log(
    carCategoryId,
    '>>>>>> THis is carCategoryId',
    category,
    '<<<<category',
  )
  return new Promise(resolve => {
    return carCategoriesRef
      .doc(carCategoryId)
      .set(category)
      .then(() => {
        resolve(carCategoryId)
      })
  })
}

const subscribeTrip = (tripId, callback) => {
  console.log(tripId, 'THIS IS TRIPID ', callback, 'this is callback')
  if (tripId) {
    return tripRef.doc(tripId).onSnapshot(doc => {
      const trip = doc.data()

      return callback(trip)
    })
  }
  return
}

const subscribeTripHistory = (userId, callback) => {
  console.log(userId, 'userId', callback, 'callback')
  if (!userId) {
    return
  }
  return tripRef
    .where('passenger.id', '==', userId)
    .where('status', '==', 'trip_completed')
    .onSnapshot(snapshot => {
      const data = snapshot?.docs.map(doc => doc.data())
      data.sort((a, b) => b.tripEndTime - a.tripEndTime)

      return callback(data)
    })
}

const subscribeCars = callback => {
  console.log("subscribeCars???????????");
  return usersRef
    .where('role', '==', 'driver')
    .where('inProgressOrderID', '==', null)
    .onSnapshot(snapshot => {
      console.log(snapshot,"this is snapshot");
      const cars = snapshot?.docs.map(doc => {
        const data = doc.data()
        const driver = data?.location
        console.log(driver,"driverdriverdriverdriverdriverdriverdriver");
        return { ...driver, carType: data?.carType }
      })
      callback(cars)
    })
}

const rateDriver = (driverId, newRating) => {
  return usersRef
    .doc(driverId)
    .get()
    .then(doc => {
      const user = doc.data()
      const ratings = user?.ratings ?? 0
      const ratingsCount = user?.ratingsCount ?? 0
      const totalNRatings = ratingsCount + 1
      const ratingsSum = Math.floor(ratings * ratingsCount) + newRating
      const calRatings = ratingsSum / totalNRatings

      usersRef.doc(driverId).update({
        ratingsCount: firebase.firestore.FieldValue.increment(1),
        ratings: Number(calRatings?.toFixed(2)),
      })
    })
}

export default {
  createTrip,
  updateTrip,
  getTrip,
  subscribeTrip,
  subscribeTripHistory,
  getCarCategories,
  setCarCategories,
  subscribeCars,
  rateDriver,
  cancelTrip,
}
