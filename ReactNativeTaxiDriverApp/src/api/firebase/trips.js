import { firebase } from '../../Core/api/firebase/config'

const tripRef = firebase.firestore().collection('taxi_trips')
const carCategoriesRef = firebase.firestore().collection('taxi_car_categories')
const usersRef = firebase.firestore().collection('users')

const createTrip = trip => {
  return new Promise(resolve => {
    const tripId = tripRef.doc().id
    tripRef
      .doc(tripId)
      .set({ ...trip, id: tripId }, { merge: true })
      .then(() => {
        resolve(tripId)
        usersRef.doc(trip.passenger.id).update({ inProgressOrderID: tripId })
      })
      .catch(() => resolve())
  })
}

const updateTrip = (tripId, trip) => {
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
  if (tripId) {
    return tripRef.doc(tripId).onSnapshot(doc => {
      const trip = doc.data()

      return callback(trip)
    })
  }
  return
}

const subscribeTripHistory = (userId, callback) => {
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
  return usersRef
    .where('role', '==', 'driver')
    .where('inProgressOrderID', '==', null)
    .onSnapshot(snapshot => {
      const cars = snapshot?.docs.map(doc => {
        const data = doc.data()
        const driver = data?.location
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
