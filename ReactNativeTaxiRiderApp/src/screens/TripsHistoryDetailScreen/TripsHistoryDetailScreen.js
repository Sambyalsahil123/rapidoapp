import React, { useLayoutEffect } from 'react'
import { View, Text } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useTheme } from 'dopenative'
import HistoryMap from '../TripHistoryScreen/HistoryMap'
import dynamicStyles from './styles'
import { useConfig } from '../../config'

export default function TripsHistoryDetailScreen(props) {
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const config = useConfig()

  const trip = props.route?.params?.trip
  const { navigation } = props

  const date = new Date(trip?.tripEndTime)
  const timeOptions = { hour: '2-digit', minute: '2-digit' }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: styles.navHeaderContainer,
    })
  }, [navigation])

  const onReceiptPress = () => {
    navigation.navigate('TripReceipt', { trip })
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <HistoryMap
          origin={trip.pickup}
          destination={trip.dropoff}
          coordinates={trip.tripCoordinates}
        />
      </View>
      <View style={styles.detialContainer}>
        <View style={styles.dateContainer}>
          <Text style={styles.date}>{`${date.toLocaleDateString(
            'en-US',
          )}, ${date.toLocaleTimeString('en-US', timeOptions)}`}</Text>
          <Text style={styles.rideType}>{`${trip?.driver?.carName ?? ''} ${
            trip?.driver?.carNumber ?? ''
          }`}</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text
            style={
              styles.price
            }>{`${config.displayCurrencyTitle}${trip?.price}`}</Text>
        </View>
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.routeIindicatorContainer}>
          <View style={styles.circle} />

          <View style={styles.line} />

          <View style={styles.square} />
        </View>
        <View style={styles.routeDescriptionContainer}>
          <Text style={styles.routeTitle}>{trip?.pickup?.title}</Text>
          <Text style={styles.routeTitle}>{trip?.dropoff?.title}</Text>
        </View>
        <View style={styles.receiptContainer}>
          <TouchableOpacity
            onPress={onReceiptPress}
            style={styles.buttonContainer}>
            <Text style={styles.receiptTitle}>{'Receipt'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
