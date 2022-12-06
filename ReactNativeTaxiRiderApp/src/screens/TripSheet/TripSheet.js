import React, { useRef, useCallback, useEffect, useState } from 'react'
import { Alert, View, Text, TouchableOpacity, Image } from 'react-native'
import { useIsFocused } from '@react-navigation/core'
import { useDispatch, useSelector } from 'react-redux'
import { BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { useTheme, useTranslations } from 'dopenative'
import dynamicStyles from './styles'
import {
  setbottomSheetSnapPoints,
  setTripCoordinates,
  resetTripState,
  setTripDescription,
} from '../../redux'
import { tripsAPIManager } from '../../api'
import { setUserData } from '../../Core/onboarding/redux/auth'
import { getETAMinutesFromPoints } from '../../utils'
import  { useConfig } from '../../config'

export default function TripSheet(props) {
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const config = useConfig()

  const { navigation, route } = props

  const currentTripId = route?.params?.currentTripId

  const dispatch = useDispatch()
  const isFocus = useIsFocused()

  const currentUser = useSelector(({ auth }) => auth.user)
  const trip = useSelector(state => state.trip.tripDescription)
  const tripCoordinates = useSelector(state => state.trip.tripCoordinates)
  const selectedPaymentMethod = useSelector(
    ({ payment }) => payment.selectedPaymentMethod,
  )
  const destination = useSelector(state => state.trip.destination)
  const dropoffETA = useSelector(state => state.trip.dropoffETA)

  const [driverETAMinutes, setDriverETAMinutes] = useState('')
  const [destinationETAMinutes, setDestinationETAMinutes] = useState('')

  const unsubscribeTripCoordinates = useRef()

  const driverName = `${trip?.driver?.firstName ?? ''} ${
    trip?.driver?.lastName ?? ''
  }`

  useEffect(() => {
    if (trip.status !== 'trip_completed') {
      return
    }
    let tripEndedDescription = 'Your trip has ended'

    if (currentUser.defaultPaymentKey === 'cash') {
      tripEndedDescription = `Please Pay your driver ${config.currency?.toUpperCase()}${
        trip.price
      }`
    }

    Alert.alert(localized('Trip Completed'), localized(tripEndedDescription), [
      {
        text: localized('OK'),
        onPress: onTripCompleted,
      },
    ])
    setRecentPlaces()
  }, [trip.status])

  useEffect(() => {
    if (trip.status === 'driver_accepted') {
      getDriverETA()
    }
  }, [trip.status, tripCoordinates.carDrive])

  useEffect(() => {
    getDestinationETA()
  }, [trip.status, tripCoordinates.carDrive])

  useEffect(() => {
    onPaymentMethodChange()
  }, [currentUser.defaultPaymentKey])

  useEffect(() => {
    onDestinationChange()
  }, [destination])

  useEffect(() => {
    unsubscribeTripCoordinates.current = tripsAPIManager.subscribeTrip(
      trip?.id ?? currentTripId,
      onTripUpdate,
    )
    return unsubscribeListener
  }, [])

  const setRecentPlaces = () => {
    if (trip?.dropoff?.name) return
    const newSavedPlaces = currentUser?.savedPlaces ?? []
    if (newSavedPlaces.length < 1) {
      newSavedPlaces[0] = {}
    }
    newSavedPlaces[1] = trip.dropoff
    dispatch(
      setUserData({
        user: { ...currentUser, savedPlaces: newSavedPlaces },
      }),
    )
  }

  const unsubscribeListener = () => {
    unsubscribeTripCoordinates.current && unsubscribeTripCoordinates.current()
  }

  const onTripUpdate = updatedTrip => {
    if (updatedTrip.dropoff || updatedTrip.carDrive) {
      dispatch(
        setTripCoordinates({
          carDrive: updatedTrip.carDrive,
          dropoff: updatedTrip.dropoff,
          pickup: updatedTrip.pickup,
          routeCoordinates: updatedTrip.routeCoordinates,
          routeId: updatedTrip.routeId,
        }),
      )
    }

    if (trip?.status !== updatedTrip.status) {
      dispatch(setTripDescription(updatedTrip))
    }
  }

  const getDriverETA = async () => {
    if (tripCoordinates.carDrive && tripCoordinates.pickup) {
      const eta = await getETAMinutesFromPoints(
        tripCoordinates?.carDrive,
        tripCoordinates?.pickup,
        config.googleMapsAPIKey
      )
      setDriverETAMinutes(eta)
    }
  }

  const getDestinationETA = async () => {
    if (tripCoordinates.carDrive && tripCoordinates.dropoff) {
      const eta = await getETAMinutesFromPoints(
        tripCoordinates.carDrive,
        tripCoordinates.dropoff,
        config.googleMapsAPIKey
      )

      setDestinationETAMinutes(eta)
    }
  }

  const onDestinationChange = async () => {
    if (tripCoordinates.carDrive && destination) {
      tripsAPIManager.updateTrip(trip.id, { dropoff: destination })
      const eta = await getETAMinutesFromPoints(
        tripCoordinates.carDrive,
        destination,
        config.googleMapsAPIKey
      )
      setDestinationETAMinutes(eta)
    }
  }

  const onPaymentMethodChange = () => {
    tripsAPIManager.updateTrip(trip.id, { passenger: currentUser })
  }

  const onCancelTrip = () => {
    Alert.alert(
      localized('Cancel Trip?'),
      localized(
        'Are you sure you want to cancel? You will be charged a cancellation fee as the ride already started.',
      ),
      [
        {
          text: localized('Yes'),
          onPress: cancelTrip,
        },
        {
          text: localized('Cancel'),
          style: 'cancel',
        },
      ],
    )
  }

  const cancelTrip = () => {
    unsubscribeListener()
    tripsAPIManager.cancelTrip(trip)
    resetScreen()
  }

  const onTripCompleted = () => {
    navigation.navigate('Ratings', { driver: trip?.driver })
    resetScreen()
  }

  const resetScreen = async () => {
    dispatch(resetTripState())
  }

  const onContactDriver = () => {
    const driverID = trip.driver && trip.driver.id
    const viewerID = currentUser.id || currentUser.userID
    let channel = {
      id: viewerID < driverID ? viewerID + driverID : driverID + viewerID,
      participants: [trip.driver],
    }
    navigation.navigate('PersonalChat', { channel })
  }

  const onSwitchPayment = () => {
    navigation.navigate('ChooseWallet', { canGoBack: true })
  }

  const onChangeDropoff = () => {
    navigation.navigate('Search', { updatingDestination: true })
  }

  const getTripDescription = () => {
    const inTransit =
      trip.status === 'trip_started' || trip.status === 'trip_completed'
    const driverAccepted = trip.status === 'driver_accepted'
    let tripDescription = ''

    if (inTransit) {
      tripDescription = `Heading to ${tripCoordinates?.dropoff?.title ?? ''}`
    }

    if (driverAccepted) {
      tripDescription = `${driverName} is on the way`
    }

    return localized(tripDescription)
  }

  const handleOnLayout = useCallback(
    ({
      nativeEvent: {
        layout: { height },
      },
    }) => {
      if (isFocus) {
        dispatch(
          setbottomSheetSnapPoints({
            key: 'trip_detail',
            snapPoints: [310, '87%'],
            index: 0,
          }),
        )
      }
    },
    [],
  )

  const getETA = () => {
    if (trip.status === 'trip_started' || trip.status === 'trip_completed') {
      return destinationETAMinutes
    }
    return driverETAMinutes
  }

  const getDropoffTime = () => {
    const options = { hour: '2-digit', minute: '2-digit' }
    const dropoffETAMilliSecs =
      +new Date() + (destinationETAMinutes ?? dropoffETA) * 60 * 1000

    return new Date(dropoffETAMilliSecs)?.toLocaleTimeString('en-US', options)
  }

  return (
    <BottomSheetView
      style={styles.container}
      onLayout={isFocus && handleOnLayout}>
      <View style={styles.headerContainer}>
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{getTripDescription()}</Text>
        </View>
        <View style={styles.minuteDetailContainer}>
          <View style={styles.minuteCardContainer}>
            <Text style={styles.minuteCount}>{getETA()}</Text>
            <Text style={styles.minuteTitle}>{'min'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.rideDetailContainer}>
        <View style={styles.rideAvatarsContainer}>
          <View>
            <View style={styles.driverAvatarContainer}>
              <Image
                style={styles.driverAvatar}
                source={{
                  uri:
                    trip?.driver?.profilePictureURL ??
                    config.defaultProfilePhotoURL,
                }}
              />
            </View>
            {!!trip?.driver?.ratings && (
              <View style={styles.ratingsContainer}>
                <Text
                  style={styles.ratings}>{`${trip?.driver?.ratings} ★`}</Text>
              </View>
            )}
          </View>

          <View style={styles.carAvatarContainer}>
            <Image
              style={styles.carAvatar}
              source={{
                uri: trip?.driver?.carAvatar ?? config.defaultCarAvatar,
              }}
            />
          </View>
        </View>
        <View style={styles.carDescriptionContainer}>
          <Text style={styles.carNumber}>{trip?.driver?.carNumber}</Text>
          <Text style={styles.carName}>{trip?.driver?.carName}</Text>
        </View>
      </View>
      <View style={styles.driverContactContainer}>
        <View style={styles.driverNameContainer}>
          <Text style={styles.driverName}>{driverName}</Text>
        </View>
        <View style={styles.callIconContainer}>
          <TouchableOpacity
            onPress={onContactDriver}
            style={styles.callIconImageContainer}>
            <Image style={styles.callIcon} source={theme.icons.call} />
          </TouchableOpacity>
        </View>
      </View>
      <BottomSheetScrollView style={styles.bottomScrollContainer}>
        <View style={styles.dropoffContainer}>
          <View style={styles.bottomIconContainer}>
            <Image
              style={[styles.bottomIcon, styles.bottomIconTint]}
              source={theme.icons.pin}
            />
          </View>
          <View style={styles.bottomDescriptionContainer}>
            <Text style={styles.bottomDescription}>
              {destination?.title ?? trip?.dropoff?.title}
            </Text>
            <Text
              style={
                styles.bottomDescription
              }>{`${getDropoffTime()} drop-off`}</Text>
          </View>
          <TouchableOpacity
            onPress={onChangeDropoff}
            style={styles.bottomActionContainer}>
            <Text style={styles.bottomAction}>{'Change'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.paymentContainer}>
          <View style={styles.bottomIconContainer}>
            <Image
              style={styles.bottomIcon}
              source={selectedPaymentMethod.iconSource}
            />
          </View>
          <View style={styles.bottomDescriptionContainer}>
            <Text style={styles.bottomDescription}>{trip?.priceRange}</Text>
            <Text style={styles.bottomDescription}>
              {`${selectedPaymentMethod.cardId ? localized('Card') : ''} ${
                selectedPaymentMethod.title
              }`}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onSwitchPayment}
            style={styles.bottomActionContainer}>
            <Text style={styles.bottomAction}>{localized('Switch')}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.shareContainer}>
          <View style={styles.bottomIconContainer}>
            <Image
              style={[styles.bottomIcon, styles.bottomIconTint]}
              source={theme.icons.userFilled}
            />
          </View>
          <View style={styles.bottomDescriptionContainer}>
            <Text style={styles.bottomDescription}>
              {localized('Share Trip Status')}
            </Text>
          </View>
          <TouchableOpacity style={styles.bottomActionContainer}>
            <Text style={styles.bottomAction}>{localized('Share')}</Text>
          </TouchableOpacity>
        </View>
        {/* <View style={styles.shareContainer} /> */}

        {trip.status !== 'trip_started' && (
          <TouchableOpacity
            onPress={onCancelTrip}
            style={styles.cancelContainer}>
            <Text style={styles.cancelTitle}>{'Cancel'}</Text>
          </TouchableOpacity>
        )}
      </BottomSheetScrollView>
    </BottomSheetView>
  )
}
