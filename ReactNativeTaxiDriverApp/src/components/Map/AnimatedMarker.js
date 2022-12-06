import React, { useRef, useEffect } from 'react'
import { Dimensions } from 'react-native'
import { Marker, AnimatedRegion } from 'react-native-maps'

const screen = Dimensions.get('window')
const ASPECT_RATIO = screen.width / screen.height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

export default function AnimatedMarker({ newCoordinate, children }) {
  const coordinate = useRef(
    new AnimatedRegion({
      latitude: newCoordinate.latitude,
      longitude: newCoordinate.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }),
  ).current

  useEffect(() => {
    if (newCoordinate) {
      animateToCoordinate()
    }
  }, [newCoordinate])

  const animateToCoordinate = () => {
    const config = {
      ...newCoordinate,
      duration: 1000,
    }
    coordinate.timing(config).start()
  }

  return <Marker.Animated coordinate={coordinate}>{children}</Marker.Animated>
}
