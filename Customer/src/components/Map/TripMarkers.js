import React, { useEffect, useState, useRef } from 'react'
import { Image, View, Text } from 'react-native'
import { Marker, Polyline } from 'react-native-maps'
import { useSelector } from 'react-redux'
import { useTheme } from 'dopenative'
import dynamicStyles from './styles'
import { getCarMarker } from '../../utils'
import { getDistance } from '../../Core/location'
import AnimatedMarker from './AnimatedMarker'

export default function TripMarkers({ fitToCoordinates }) {
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const tripCoordinates = useSelector(({ trip }) => trip.tripCoordinates)
  const tripDescription = useSelector(state => state.trip?.tripDescription)

  const [coordinates, setCoordinates] = useState([])

  const prevRouteId = useRef(null)

  const tripStarted = tripDescription?.status === 'trip_started'

  useEffect(() => {
    if (
      !tripCoordinates?.routeId ||
      !tripCoordinates.routeCoordinates ||
      !tripCoordinates.carDrive
    ) {
      return
    }
    if (prevRouteId.current !== tripCoordinates?.routeId) {
      drawPolyline()
      return
    }
    trackCarDrive()
  }, [tripCoordinates?.routeId, tripCoordinates.carDrive])

  const drawPolyline = () => {
    setCoordinates(tripCoordinates.routeCoordinates)
    fitToCoordinates(tripCoordinates.routeCoordinates)
    prevRouteId.current = tripCoordinates?.routeId
  }

  const trackCarDrive = () => {
    const routeCoordinates = coordinates
    const firstPoint = routeCoordinates[0]
    const distance = getDistance(
      firstPoint?.latitude,
      firstPoint?.longitude,
      tripCoordinates?.carDrive?.latitude,
      tripCoordinates?.carDrive?.longitude,
    )

    if (distance < 1) {
      const routeCoordinatesCopy = [...coordinates]
      routeCoordinatesCopy.splice(0, 1)
      setCoordinates(routeCoordinatesCopy)
    }
  }

  const getCarDriveCoordinate = () => {
    if (coordinates?.length > 0) {
      return coordinates[0]
    }
    return tripCoordinates.carDrive
  }

  const getDestinationCoordinate = () => {
    if (coordinates?.length > 0) {
      return coordinates[coordinates?.length - 1]
    }

    return tripStarted ? tripCoordinates?.dropoff : tripCoordinates.pickup
  }

  if (!tripCoordinates.carDrive) {
    return null
  }

  const renderPolylines = () => {
    return (
      <Polyline
        key={`${tripCoordinates?.routeId}`}
        coordinates={coordinates}
        strokeColor="#000"
        strokeWidth={3}
      />
    )
  }

  const renderCarDrive = () => {
    if (!tripCoordinates.carDrive?.latitude) {
      return null
    }
    return (
      <AnimatedMarker
        key={`${tripCoordinates.carDrive?.latitude}`}
        newCoordinate={getCarDriveCoordinate()}>
        <Image
          style={[
            styles.carIcon,
            tripCoordinates.carDrive?.heading && {
              transform: [
                {
                  rotate: `${tripCoordinates.carDrive?.heading}deg`,
                },
              ],
            },
          ]}
          source={getCarMarker(tripCoordinates.carDrive?.type)}
        />
      </AnimatedMarker>
    )
  }

  const renderLocationMarker = location => {
    return (
      <Marker
        key={`${location?.latitude}${location?.longitude}`}
        coordinate={getDestinationCoordinate()}
        anchor={{ x: 0, y: 0 }}
        image={theme.icons.markerImage}>
        {location?.title && (
          <View style={styles.locationContainer}>
            <Text style={styles.locationText}>
              {location?.name ?? location?.title}
            </Text>
          </View>
        )}
      </Marker>
    )
  }

  if (tripCoordinates?.carDrive && tripDescription?.status) {
    return (
      <>
        {renderCarDrive()}
        {renderPolylines()}
        {renderLocationMarker(
          tripStarted ? tripCoordinates?.dropoff : tripCoordinates.pickup,
        )}
      </>
    )
  }
  return null
}
