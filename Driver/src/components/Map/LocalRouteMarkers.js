import React, { useEffect, useState } from 'react'
import { View, Text, Image } from 'react-native'
import { useTheme } from 'dopenative'
import { Marker } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import { useSelector, useDispatch } from 'react-redux'
import dynamicStyles from './styles'
import { setDropoffETA, setDropoffDistance } from '../../redux'
import { getCarMarker, getClosestCar } from '../../utils'
import { useConfig } from '../../config'

export default function LocalRouteMarkers({ onDirectionsReady }) {
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const config = useConfig()

  const dispatch = useDispatch()
  const cars = useSelector(({ ride }) => ride.cars)
  const tripCoordinates = useSelector(({ trip }) => trip.tripCoordinates)
  const origin = useSelector(({ trip }) => trip.origin)
  const destination = useSelector(({ trip }) => trip.destination)
  const focusedBottomSheetKey = useSelector(
    ({ bottomSheet }) => bottomSheet.bottomSheetSnapPoints?.key,
  )

  const [closestCar, setClosestCar] = useState({})
  const [closestCarETA, setClosestCarETA] = useState()
  const [coordinates, setCoordinates] = useState([])

  const isConfirmingPickup = focusedBottomSheetKey === 'confirm_pickup'
  const hasRoute = !!destination && !!origin

  useEffect(() => {
    setNearestCar()
  }, [origin])

  const setNearestCar = async () => {
    const car = getClosestCar(origin, cars)
    if (car) {
      setClosestCar(car)
    }
  }

  const getOriginCoordinate = () => {
    if (coordinates?.length > 0) {
      return coordinates[0]
    }
    return origin
  }

  const getDestinationCoordinate = () => {
    if (coordinates?.length > 0) {
      return coordinates[coordinates?.length - 1]
    }

    return destination
  }

  const onRoutingFinished = routings => {
    setCoordinates(routings.coordinates)
    dispatch(setDropoffETA(Math.floor(routings.duration)))
    setClosestCarETA(Math.floor(routings.duration))
    dispatch(setDropoffDistance(Math.floor(routings.distance)))
    onDirectionsReady(routings)
  }

  if (
    tripCoordinates?.carDrive ||
    tripCoordinates?.routeId ||
    !hasRoute ||
    isConfirmingPickup
  ) {
    return null
  }

  return (
    <>
      <MapViewDirections
        origin={{
          latitude: origin.latitude,
          longitude: origin.longitude,
        }}
        destination={{
          latitude: destination.latitude,
          longitude: destination.longitude,
        }}
        apikey={config.googleMapsAPIKey}
        strokeWidth={3}
        strokeColor={'black'}
        onReady={onRoutingFinished}
        onError={errorMessage => {
          console.log('GOT AN ERROR', errorMessage)
        }}
      />

      <Marker
        key={`${destination?.latitude}${destination?.longitude}`}
        coordinate={getDestinationCoordinate()}
        anchor={{ x: 0, y: 0 }}
        image={theme.icons.markerImage}>
        {destination.title && (
          <View style={styles.locationContainer}>
            <Text style={styles.locationText}>{destination.title}</Text>
          </View>
        )}
      </Marker>

      <Marker
        key={`${origin?.latitude}${origin?.longitude}`}
        coordinate={getOriginCoordinate()}
        anchor={{ x: 0, y: 0 }}
        image={theme.icons.markerImage}>
        {origin.title && (
          <View style={styles.locationContainer}>
            {!!closestCarETA && (
              <View style={styles.locationTimeContainer}>
                <Text style={styles.locationTimeText}>{closestCarETA}</Text>
                <Text style={styles.locationTimeTextSmall}>{'min'}</Text>
              </View>
            )}

            <Text style={styles.locationText}>{origin.title}</Text>
          </View>
        )}
      </Marker>
      {!!closestCar.latitude && (
        <Marker
          key={`${closestCar?.latitude}`}
          coordinate={{
            latitude: closestCar.latitude,
            longitude: closestCar.longitude,
          }}>
          <Image
            style={[
              styles.carIcon,
              closestCar?.heading && {
                transform: [
                  {
                    rotate: `${closestCar?.heading}deg`,
                  },
                ],
              },
            ]}
            source={getCarMarker(closestCar?.type)}
          />
        </Marker>
      )}
    </>
  )
}
