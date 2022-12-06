import React, { useEffect, useRef, useCallback } from 'react'
import { Alert, View, Image, Text, Pressable } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import { useSelector, useDispatch } from 'react-redux'
import { BottomSheetView } from '@gorhom/bottom-sheet'
import { useTheme, useTranslations } from 'dopenative'
import {
  setbottomSheetSnapPoints,
  setTripDescription,
  setTripCoordinates,
  resetTripState,
} from '../../redux'
import { tripsAPIManager } from '../../api'
import dynamicStyles from './styles'

const ConfirmRideSheet = props => {
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const { navigation, route } = props
  const currentTripId = route?.params?.currentTripId

  const isFocus = useIsFocused()

  const dispatch = useDispatch()
  const currentUser = useSelector(({ auth }) => auth.user)
  const tripCoordinates = useSelector(({ trip }) => trip.tripCoordinates)
  const tripDescription = useSelector(({ trip }) => trip.tripDescription)
  const ride = useSelector(({ trip }) => trip.ride)
  const priceRange = useSelector(({ trip }) => trip.priceRange)
  const origin = useSelector(({ trip }) => trip.origin)
  const destination = useSelector(({ trip }) => trip.destination)
  const bottomSheetKey = useSelector(
    ({ bottomSheet }) => bottomSheet.bottomSheetSnapPoints.key,
  )

  const unsubscribeTripCoordinates = useRef()
  const tripId = useRef()

  const hasDriverCoordinates = !!tripCoordinates?.carDrive

  useEffect(() => {
    createNewTrip()

    return unsubscribeListener
  }, [])

  useEffect(() => {
    if (tripDescription.driver && bottomSheetKey === 'confirm_ride') {
      setTimeout(() => {
        onDriverAvailable()
      }, 3000)
    }
  }, [tripDescription.driver])

  const unsubscribeListener = () => {
    unsubscribeTripCoordinates.current && unsubscribeTripCoordinates.current()
  }

  const onDriverAvailable = () => {
    tripId.current = null
    unsubscribeListener()
    navigation.navigate('TripSheet')
  }

  const createNewTrip = async () => {
    if (currentTripId && !tripId.current) {
      tripId.current = currentTripId
      subscribeTripCoordinates()
      return
    }

    if (tripId.current || !isFocus) {
      return
    }

    const newTrip = {
      pickup: origin,
      dropoff: destination,
      passenger: currentUser,
      status: 'awaiting_driver',
      carType: ride?.type,
      ride,
      priceRange,
    }

    tripId.current = await tripsAPIManager.createTrip(newTrip)
    if (tripId.current) {
      subscribeTripCoordinates()
    }
  }

  const subscribeTripCoordinates = () => {
    unsubscribeTripCoordinates.current = tripsAPIManager.subscribeTrip(
      tripId.current,
      onTripUpdate,
    )
  }

  const onTripUpdate = trip => {
    if (!hasDriverCoordinates && trip.carDrive) {
      dispatch(
        setTripCoordinates({
          carDrive: trip.carDrive,
          pickup: trip.pickup,
          dropoff: trip.dropoff,
        }),
      )
    }
    if (!tripDescription?.driver && trip.driver) {
      dispatch(setTripDescription(trip))
    }

    if (trip.status === 'no_driver_found') {
      Alert.alert(
        localized('No Driver Found'),
        localized(
          'There is no driver close to your pickup location. Please try later.',
        ),
        [
          {
            text: localized('OK'),
            onPress: resetScreen,
          },
        ],
      )
    }
  }

  const resetScreen = () => {
    dispatch(resetTripState())
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'HomeSheet',
        },
      ],
    })
  }

  const handleOnLayout = useCallback(
    ({
      nativeEvent: {
        layout: { height },
      },
    }) => {
      dispatch(
        setbottomSheetSnapPoints({
          key: 'confirm_ride',
          snapPoints: [height, height],
          index: 0,
        }),
      )
    },
    [],
  )

  const title = hasDriverCoordinates
    ? localized('Connecting you to a driver')
    : localized('Confirming your ride')
  const loadImage = hasDriverCoordinates
    ? theme.icons.driver
    : theme.icons.mapLocation

  return (
    <BottomSheetView
      style={styles.container}
      onLayout={isFocus && handleOnLayout}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={loadImage} />
      </View>
    </BottomSheetView>
  )
}

export default React.memo(ConfirmRideSheet)
