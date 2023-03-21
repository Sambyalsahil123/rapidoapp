import React, { useEffect, useState, useRef } from 'react'
import { Alert, Platform, PixelRatio } from 'react-native'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import Geolocation from '@react-native-community/geolocation'
import { useSelector } from 'react-redux'
import { useTheme } from 'dopenative'
import dynamicStyles from './styles'
import TripMarkers from './TripMarkers'
import CarMarkers from './CarMarkers'
import LocalRouteMarkers from './LocalRouteMarkers'
import { calculateDelta } from '../../utils'
import ChangePickupMarker from './ChangePickupMarker'

const Map = ({ containerStyle }) => {
  const focusedBottomSheetKey = useSelector(
    ({ bottomSheet }) => bottomSheet.bottomSheetSnapPoints?.key,
  )

  const [region, setRegion] = useState()

  const mapRef = useRef(null)

  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const hasTrip = focusedBottomSheetKey === 'trip_detail'

  useEffect(() => {
    const options = {
      timeout: 2000,
      // enableHighAccuracy: true,
      // maximumAge: 1000,
    }

    Geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude, accuracy } }) => {
        setRegion(calculateDelta(latitude, longitude, accuracy))
      },
      error => Alert.alert(error.message),
      options,
    )
  }, [])

  const getPixelSize = pixels => {
    return Platform.select({
      ios: pixels,
      android: PixelRatio.getPixelSizeForLayoutSize(pixels),
    })
  }

  const fitToCoordinates = coordinates => {
    mapRef.current.fitToCoordinates(coordinates, {
      edgePadding: {
        right: getPixelSize(50),
        left: getPixelSize(50),
        top: getPixelSize(50),
        bottom: getPixelSize(350),
      },
      animated: true,
    })
  }

  const onDirectionsReady = ({ coordinates, duration }) => {
    if (!hasTrip) {
      fitToCoordinates(coordinates)
    }
  }

  const fitTripMarkers = coordinates => {
    fitToCoordinates(coordinates)
  }

  return (
    <MapView
      ref={mapRef}
      // provider={PROVIDER_GOOGLE}
      style={[styles.container, containerStyle]}
      initialRegion={region}
      loadingEnabled={true}
      showsUserLocation={true}>
      <LocalRouteMarkers onDirectionsReady={onDirectionsReady} />
      <ChangePickupMarker fitToCoordinates={fitToCoordinates} />
      <TripMarkers fitToCoordinates={fitTripMarkers} />
      <CarMarkers />
    </MapView>
  )
}

export default React.memo(Map)
