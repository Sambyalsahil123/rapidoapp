import { getETA } from '../Core/delivery/api/directions'

export const getDistanceRadius = (lat1, lon1, lat2, lon2) => {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0
  } else {
    var radlat1 = (Math.PI * lat1) / 180
    var radlat2 = (Math.PI * lat2) / 180
    var theta = lon1 - lon2
    var radtheta = (Math.PI * theta) / 180
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
    if (dist > 1) {
      dist = 1
    }
    dist = Math.acos(dist)
    dist = (dist * 180) / Math.PI
    dist = dist * 60 * 1.1515 //is statute miles
    return dist * 1.609344 //is kilometers
  }
}

const calRideTypeETAMins = (dropoffETA, ride) => {
  return Math.floor((0.83 / ride.averageSpeedPerMin) * dropoffETA)
}

export const getRideETA = (dropoffETA, ride) => {
  if (!dropoffETA) {
    return ''
  }
  const options = { hour: '2-digit', minute: '2-digit' }
  const dropoffETASecs = calRideTypeETAMins(dropoffETA, ride) * 60000
  const dropoffTime = new Date(+new Date() + dropoffETASecs)

  return `${dropoffTime.toLocaleTimeString('en-US', options)} drop off`
}

export const getRideEstimatedPrice = (
  dropoffETA,
  tripDistance,
  ride,
  currency,
) => {
  if (!tripDistance || !dropoffETA || !ride) {
    return ''
  }
  const minTotalCost = getRideActualPrice(dropoffETA, tripDistance, ride)
  const maxTotalCost = minTotalCost * 1.19

  return `${currency}${minTotalCost?.toFixed(
    2,
  )} - ${currency}${maxTotalCost?.toFixed(2)}`
}

export const getRideActualPrice = (tripTime, tripDistance, ride) => {
  if (!tripDistance) {
    return ''
  }
  const tripTimeMins = calRideTypeETAMins(tripTime, ride)
  const kmCost = tripDistance * ride.costPerKm
  const minsCost = tripTimeMins * ride.costPerMin
  const rideCost = ride.baseFare + minsCost + kmCost
  const minTotalCost = rideCost < ride.minimumFare ? ride.minimumFare : rideCost

  return Number(minTotalCost.toFixed(2))
}

export const getCarImage = type => {
  if (type === 'uber_x') {
    return require('../assets/images/UberX.png')
  }
  if (type === 'comfort') {
    return require('../assets/images/Comfort.png')
  }
  return require('../assets/images/UberXL.png')
}

export const getCarMarker = type => {
  if (type === 'uber_x') {
    return require('../assets/images/top-UberX.png')
  }
  if (type === 'comfort') {
    return require('../assets/images/top-Comfort.png')
  }
  return require('../assets/images/top-UberXL.png')
}

export const getCarType = type => {
  if (type === 'uber_x') {
    return 'TaxiX'
  }
  if (type === 'comfort') {
    return 'Comfort'
  }
  return 'TaxiXL'
}

export const getETAMinutesFromPoints = async (pointA, pointB, apiKey) => {
  const eta = await getETA(pointA, pointB, apiKey)
  if (eta) {
    const etaTime = +new Date() + eta * 1000
    const currentTime = +new Date()
    return Math.round((etaTime - currentTime) / (1000 * 60))
  }
  return ''
}

export const getClosestCar = (userLocation, cars) => {
  let closestDistance = Number.NEGATIVE_INFINITY
  let closestCarIndex = -1
  cars.forEach((car, index) => {
    const distanceRadius = getDistanceRadius(
      userLocation.latitude,
      userLocation.longitude,
      car?.latitude,
      car?.longitude,
    )
    if (distanceRadius < closestDistance) {
      closestDistance = distanceRadius
      closestCarIndex = index
    }
  })

  if (closestCarIndex > -1) {
    return cars[closestCarIndex]
  }
  return null
}

export const calculateDelta = (latitude, longitude, distance) => {
  const oneDegreeOfLatitudeInMeters = 111.32 * 10
  const latitudeDelta = distance / oneDegreeOfLatitudeInMeters
  const longitudeDelta =
    distance /
    (oneDegreeOfLatitudeInMeters * Math.cos(latitude * (Math.PI / 180)))

  return {
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta,
  }
}
