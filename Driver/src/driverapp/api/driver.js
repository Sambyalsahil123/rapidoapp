import uuid from 'uuidv4'
import { firebase } from '../../Core/api/firebase/config'
import { getRideActualPrice, getDistanceRadius } from '../../utils'
import { chargeStripeCustomer } from '../../Core/payment/api'
import { firebase as fb } from '@react-native-firebase/firestore'

export class DriverAPIManager {
  constructor(
    config,
    callback = console.log,
    orderUpdatesCallback = console.log,
  ) {
    this.config = config
    this.callback = callback
    this.orderUpdatesCallback = orderUpdatesCallback
    this.tripsRef = firebase.firestore().collection('taxi_trips')
    this.usersRef = firebase.firestore().collection('users')
    this.paymentMethodsRef = firebase
      .firestore()
      .collection(config.FIREBASE_COLLECTIONS.PAYMENT_METHODS)
  }

  subscribeToDriverDataUpdates = driver => {
    console.log(
      driver,
      driver.id,
      'this is driver in subscribeToDriverDataUpdates',
    )
    if (!driver || !driver.id || driver.id.length == 0) {
      return
    }
    // We're listening to the incoming requests for orders

    this.unsubscribeSnapshot = this.usersRef
      .doc(driver.id)
      .onSnapshot(this.onDriverUserDataUpdate, error => {
        console.log(error, 'this is firebase error error')
        console.log(driver.id, 'this is Driver ID')
      })
  }

  subscribeToOrder = orderID => {
    if (!orderID || orderID.length == 0) {
      return
    }
    console.log(orderID, 'this is ORDER ID')
    this.unsubscribeOrder = this.tripsRef
      .doc(orderID)
      .onSnapshot(this.onOrderDataUpdate, error => {
        console.log(error, 'err in subscribeToOrder ')
      })
  }

  goOnline = async driver => {

    console.log(driver.id,"this is driver?>>>>?>?>?>?>?>?>?>??")
    if (!driver || !driver.id ) {
      return
    }

    console.log(driver.id, 'DRIVER_ID')

    let updatedData
    const callback = this.callback
    // const userRef = this.usersRef
    this.usersRef.doc(driver.id).update({ isActive: true, id : driver.id }).then(() => {
      callback()
    })

    // const firebaseData = this.usersRef.doc(driver.id).get()
    // updatedData = { ...firebaseData.data(), id: firebaseData.id }
    // console.log(updatedData, 'DATA____!@#')
    // this.callback(updatedData)

    // this.callback && this.callback && this.callback('isOnline')
  }

  goOffline = async driver => {
    if (!driver || !driver.id || driver.id.length == 0) {
      return
    }
    const callback = this.callback
    this.usersRef.doc(driver.id).update({ isActive: false }).then(() => {
      callback()
    })
  }

  unsubscribe = () => {
    this.unsubscribeSnapshot && this.unsubscribeSnapshot()
    this.unsubscribeOrder && this.unsubscribeOrder()
  }

  accept = async (order, driver) => {
    if (!driver || !driver.id || driver.id.length == 0) {
      return
    }
    if (!order || !order.id || order.id.length == 0) {
      return
    }
    this.tripsRef.doc(order.id).update({
      status: 'driver_accepted',
      driver,
      driverID: driver.id,
      carDrive: driver.location,
    })

    this.usersRef.doc(driver.id).update({
      orderRequestData: null,
      inProgressOrderID: order.id,
    })
  }

  reject = async (order, driver) => {
    var rejectedByDrivers = order.rejectedByDrivers
      ? order.rejectedByDrivers
      : []
    rejectedByDrivers.push(driver.id)

    this.usersRef.doc(driver.id).update({ orderRequestData: null })

    this.tripsRef
      .doc(order.id)
      .update({ status: 'driver_rejected', rejectedByDrivers })
  }

  onDelete = orderID => {
    this.tripsRef
      .doc(orderID)
      .delete()
      .then(result => console.warn(result))
  }

  markAsPickedUp = async order => {
    this.tripsRef
      .doc(order.id)
      .update({ status: 'trip_started', tripStartTime: +new Date() })
  }

  getPaymentMethod = async order => {
    try {
      const doc = await this.paymentMethodsRef
        .doc(order.passenger.defaultPaymentKey)
        .get()

      return doc.data()
    } catch (error) {
      console.log(error)
      return
    }
  }

  chargePassenger = async (order, tripEndTime) => {
    const tripTime = (tripEndTime - order.tripStartTime) / (1000 * 60)
    const tripDistance = getDistanceRadius(
      order.pickup.latitude,
      order.pickup.longitude,
      order.carDrive?.latitude ?? order.dropoff?.latitude,
      order.carDrive?.longitude ?? order.dropoff?.longitude,
    )

    const price = getRideActualPrice(tripTime, tripDistance, order.ride)

    if (order.passenger?.defaultPaymentKey === 'cash') {
      return { price, isPaymentCompleted: false }
    }

    const paymentMethod = await this.getPaymentMethod(order)

    if (paymentMethod?.paymentMethodId) {
      const rs = await chargeStripeCustomer(this.config, {
        email: order.passenger.email,
        currency: this.config.currency,
        amount: Number((price * 100).toFixed(2)),
        paymentMethodId: paymentMethod.paymentMethodId,
      })
      if (rs.data.succeeded) {
        return { price, isPaymentCompleted: true }
      }
    }

    return { isPaymentCompleted: false }
  }

  markAsCompleted = async (order, driver) => {
    const tripEndTime = +new Date()
    const { isPaymentCompleted, price } = await this.chargePassenger(
      order,
      tripEndTime,
    )
    const newSavedPlaces = order?.passenger?.savedPlaces ?? []
    if (!order?.dropoff?.name) {
      if (newSavedPlaces.length < 1) {
        newSavedPlaces[0] = {}
      }
      newSavedPlaces[1] = order.dropoff
    }

    if (price) {
      this.tripsRef.doc(order.id).update({
        status: 'trip_completed',
        price,
        tripEndTime,
      })

      this.usersRef
        .doc(driver.id)
        .update({ inProgressOrderID: null, orderRequestData: null })

      this.usersRef
        .doc(order.passenger.id)
        .update({ inProgressOrderID: null, savedPlaces: newSavedPlaces })
    }
    return { isPaymentCompleted, price }
  }

  updateCarDrive = (order, carDrive) => {
    if (order?.id) {
      this.tripsRef.doc(order?.id).set({ carDrive }, { merge: true })
    }
  }

  updateTripCoordinates = (order, coordinates) => {
    if (order.id) {
      const routeId = this.tripsRef.doc().id
      this.tripsRef.doc(order.id).set(
        {
          tripCoordinates: coordinates,
          routeCoordinates: coordinates,
          routeId,
        },
        { merge: true },
      )
      return routeId
    }
  }

  updateCurrentCoordinates = (order, routeCoordinates) => {
    if (order.id) {
      const routeId = this.tripsRef.doc().id
      this.tripsRef
        .doc(order.id)
        .set({ routeId, routeCoordinates }, { merge: true })
      return routeId
    }
  }

  onDriverUserDataUpdate = querySnapshot => {
    const docs = querySnapshot.docs
    if (docs?.length > 0) {
      const data = docs[0].data()
      if (data?.id) {
        this.callback && this.callback(data)
      }
    } else {
      const data = querySnapshot.data()
      if (data?.id) {
        this?.callback && this.callback(data)
      }
    }
  }

  onOrderDataUpdate = querySnapshot => {
    const docs = querySnapshot.docs
    if (docs?.length > 0) {
      console.log(docs, 'docssß', docs[0], '<<<<<<<<<<<<<<<<<')
      this.orderUpdatesCallback && this.orderUpdatesCallback(docs[0].data())
    } else {
      this.orderUpdatesCallback &&
        this.orderUpdatesCallback(querySnapshot.data())
    }
  }
}
