import React from 'react'
import { Image } from 'react-native'
import { useSelector } from 'react-redux'
import { useTheme } from 'dopenative'
import dynamicStyles from './styles'
import { getCarMarker } from '../../utils'
import AnimatedMarker from './AnimatedMarker'

export default function CarMarkers() {
  const destination = useSelector(({ trip }) => trip.destination)
  const tripCoordinates = useSelector(({ trip }) => trip.tripCoordinates)
  const cars = useSelector(({ ride }) => ride.cars)

  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  if (destination || tripCoordinates) {
    return null
  }

  return cars.map(car => {
    return (
      <AnimatedMarker
        key={`${tripCoordinates.carDrive?.latitude}`}
        newCoordinate={{
          latitude: car?.latitude,
          longitude: car?.longitude,
        }}>
        <Image
          style={[
            styles.carIcon,
            car?.heading && {
              transform: [
                {
                  rotate: `${car?.heading}deg`,
                },
              ],
            },
          ]}
          source={getCarMarker(car?.carType)}
        />
      </AnimatedMarker>
    )
  })
}
