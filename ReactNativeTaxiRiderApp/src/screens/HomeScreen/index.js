import React, { useLayoutEffect, useState, useEffect, useRef } from 'react'
import { View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useSelector, useDispatch } from 'react-redux'
import { useTheme } from 'dopenative'
import Map from '../../components/Map'
import BottomSheetScreen from '../BottomSheetScreen/BottomSheetScreen'
import {
  setCarCategories,
  setCars,
  setSelectedPaymentMethod,
  updatePaymentMethods,
} from '../../redux'
import styles from './styles'
import BottomButton from '../../components/BottomButton/BottomButton'
import { useConfig } from '../../config'
import MenuIcon from '../../components/MenuIcon/MenuIcon'
import { PaymentAPIManager } from '../../Core/api'
import { tripsAPIManager } from '../../api'
import { setUserData } from '../../Core/onboarding/redux/auth'
import { updateUser } from '../../Core/users'

const HomeScreen = () => {
  const { theme } = useTheme()
  const config = useConfig()
  const navigation = useNavigation()

  const dispatch = useDispatch()

  const currentUser = useSelector(state => state.auth.user)
  const paymentMethods = useSelector(({ payment }) => payment.paymentMethods)
  const origin = useSelector(({ trip }) => trip.origin)
  const destination = useSelector(({ trip }) => trip.destination)
  const tripCoordinates = useSelector(({ trip }) => trip.tripCoordinates)
  const cars = useSelector(({ ride }) => ride.cars)
  const bottomSheetKey = useSelector(
    ({ bottomSheet }) => bottomSheet.bottomSheetSnapPoints.key,
  )

  const [allCarCategories, setAllCarCategories] = useState([])

  const hasTrip =
    !!tripCoordinates.carDrive || bottomSheetKey === 'confirm_ride'
  const defaultPaymentKey = currentUser.defaultPaymentKey

  const paymentMethodDataManager = useRef(new PaymentAPIManager(config))
  const unsubscribeCars = useRef()

  const hasRoute = origin && destination

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: renderNavHeaderLeft,
    })
  }, [navigation, hasRoute, hasTrip])

  useEffect(() => {
    filterAvailableCarCategories()
  }, [cars])

  useEffect(() => {
    const unsubscribePaymentMethods =
      paymentMethodDataManager.current.subscribePaymentMethods(
        currentUser.id,
        setPaymentMethods,
      )
    fetchCarCategories()
    fetchCurrentTripIfAny()

    return () => {
      unsubscribePaymentMethods && unsubscribePaymentMethods()
      unsubscribeCars.current && unsubscribeCars.current()
    }
  }, [])

  useEffect(() => {
    if (paymentMethods?.length > 0) {
      const selectedIndex = paymentMethods.findIndex(
        paymentMethod => paymentMethod.key === defaultPaymentKey,
      )

      if (selectedIndex > -1) {
        dispatch(setSelectedPaymentMethod(paymentMethods[selectedIndex]))
        return
      }
      dispatch(setSelectedPaymentMethod(paymentMethods[0]))
      updateUser(currentUser.id, {
        defaultPaymentKey: paymentMethods[0].key,
      })
      dispatch(
        setUserData({
          user: { ...currentUser, defaultPaymentKey: paymentMethods[0].key },
        }),
      )
    }
  }, [paymentMethods])

  const setPaymentMethods = methods => {
    dispatch(updatePaymentMethods(methods))
  }

  const fetchCarCategories = () => {
    tripsAPIManager.getCarCategories().then(result => {
      setAllCarCategories(result)
      unsubscribeCars.current = tripsAPIManager.subscribeCars(onCarsAvailable)
    })
  }

  const fetchCurrentTripIfAny = () => {
    tripsAPIManager.getTrip(currentUser.inProgressOrderID).then(trip => {
      const tripStatus = {
        driver_accepted: 'driver_accepted',
        driver_rejected: 'driver_rejected',
        trip_started: 'trip_started',
        awaiting_driver: 'awaiting_driver',
      }
      if (trip) {
        if (tripStatus[trip.status] === 'awaiting_driver') {
          navigation.navigate('ConfirmRideSheet', { currentTripId: trip.id })
          return
        }
        if (
          tripStatus[trip.status] &&
          tripStatus[trip.status] !== 'awaiting_driver'
        ) {
          navigation.navigate('TripSheet', { currentTripId: trip.id })
          return
        }
      }
    })
  }

  const onCarsAvailable = updatedcars => {
    dispatch(setCars(updatedcars))
  }

  const filterAvailableCarCategories = () => {
    const availableCarCategories = allCarCategories?.filter(carCategory => {
      return cars?.find(car => car.carType === carCategory.type)
    })

    if (availableCarCategories?.length > 0) {
      dispatch(setCarCategories(availableCarCategories))
    }
  }

  const onNavIconPress = () => {
    if (destination && !hasTrip) {
      navigation.goBack()
    } else {
      navigation.openDrawer()
    }
  }

  const renderNavHeaderLeft = () => {
    return (
      <MenuIcon
        source={destination && !hasTrip ? theme.icons.back : theme.icons.menu}
        onPress={onNavIconPress}
        withShadow={true}
      />
    )
  }

  return (
    <View style={styles.container}>
      <Map />
      <BottomSheetScreen />
      <BottomButton isVisible={hasRoute} />
    </View>
  )
}

export default HomeScreen
