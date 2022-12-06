import React, { useLayoutEffect } from 'react'
import { View, ScrollView, Text, Image } from 'react-native'
import { useTheme } from 'dopenative'
import dynamicStyles from './styles'
import { useConfig } from '../../config'

export default function TripReceipt(props) {
  const { navigation, route } = props
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const config = useConfig()

  const trip = route?.params?.trip

  const dateOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
  const date = new Date(trip?.tripEndTime)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: styles.navHeaderContainer,
    })
  }, [navigation])

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.rowsContainer, styles.messageContainer]}>
        <View style={styles.messageDescriptionContainer}>
          <Text style={styles.subtitle}>
            {date.toLocaleDateString('en-US', dateOptions)}
          </Text>
          <Text style={styles.mainTitle}>{'Thanks for riding,'}</Text>
          <Text style={styles.mainTitle}>{`${
            trip?.passenger?.firstName ?? ''
          } ${trip?.passenger?.lastName ?? ''}`}</Text>
        </View>
        <View style={styles.messageImageContainer}>
          <Image
            source={{
              uri: trip?.driver?.carAvatar ?? config.defaultCarAvatar,
            }}
            style={styles.messageImage}
            resizeMode={'contain'}
          />
        </View>
      </View>
      <View style={[styles.rowsContainer, styles.totalContainer]}>
        <View style={styles.amountLabelContainer}>
          <Text style={styles.mainTitle}>{'Total'}</Text>
        </View>
        <View style={styles.amountContainer}>
          <Text
            style={
              styles.mainTitle
            }>{`${config.displayCurrencyTitle}${trip.price}`}</Text>
        </View>
      </View>
      <View style={[styles.rowsContainer, styles.tripFareTitleContainer]}>
        <View style={styles.amountLabelContainer}>
          <Text style={styles.subtitle}>{'Trip Fare'}</Text>
        </View>
        <View style={styles.amountContainer}>
          <Text
            style={
              styles.subtitle
            }>{`${config.displayCurrencyTitle}${trip.price}`}</Text>
        </View>
      </View>
      <View style={[styles.rowsContainer, styles.tripFareTitleContainer]}>
        <View style={styles.amountLabelContainer}>
          <Text style={styles.subtitleBold}>{'Subtotal'}</Text>
          <Text style={styles.subtitle}>{'Tolls, Surcharge, and Fees'}</Text>
        </View>
        <View style={styles.amountContainer}>
          <Text
            style={
              styles.subtitleBold
            }>{`${config.displayCurrencyTitle}${trip.price}`}</Text>
          <Text
            style={
              styles.subtitle
            }>{`${config.displayCurrencyTitle}${trip.price}`}</Text>
        </View>
      </View>
    </ScrollView>
  )
}
