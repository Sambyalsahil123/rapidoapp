import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { useTheme } from 'dopenative'
import dynamicStyles from './styles'
import HistoryMap from '../HistoryMap'
import { useConfig } from '../../../config'

export default function TripHistoryItem({ item }) {
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const navigation = useNavigation()
  const config = useConfig()

  const date = new Date(item?.tripEndTime)
  const timeOptions = { hour: '2-digit', minute: '2-digit' }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate('TripsDetail', { trip: item })}
        style={styles.detialContainer}>
        <View style={styles.dateContainer}>
          <Text style={styles.date}>{`${date.toLocaleDateString(
            'en-US',
          )}, ${date.toLocaleTimeString('en-US', timeOptions)}`}</Text>
          <Text style={styles.rideType}>{`${item?.driver?.carName ?? ''} ${
            item?.driver?.carNumber ?? ''
          }`}</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text
            style={
              styles.price
            }>{`${config.displayCurrencyTitle}${item?.price}`}</Text>
        </View>
        <View style={styles.iconContainer}>
          <Image style={styles.icon} source={theme.icons.rightArrow} />
        </View>
      </TouchableOpacity>
      <View style={styles.mapContainer}>
        <HistoryMap
          origin={item.pickup}
          destination={item.dropoff}
          coordinates={item.tripCoordinates}
          zoomEnabled={false}
          scrollEnabled={false}
        />
      </View>
    </View>
  )
}
