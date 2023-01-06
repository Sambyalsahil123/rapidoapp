import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
} from 'react'
import {
  Image,
  PermissionsAndroid,
  Platform,
  View,
  TouchableOpacity,
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps'
import { useTheme, useTranslations } from 'dopenative'
import Geolocation from '@react-native-community/geolocation'
import dynamicStyles from './styles'
import Hamburger from '../../../components/Hamburger/Hamburger'
import { setUserData } from '../../../Core/onboarding/redux/auth'
import { updateUser } from '../../../Core/users'
import { getDistance } from '../../../Core/location'
import { DriverAPIManager } from '../../api/driver'
import { TNEmptyStateView } from '../../../Core/truly-native'
import { NewOrderRequestModal } from '../../components'
import { getDirections } from '../../../Core/delivery/api/directions'
import { OrderPreviewCard } from '../../components'
import { useConfig } from '../../../config'

function HomeScreen(props) {
  const { navigation } = props
  const config = useConfig()

  const [deliveryDriverData, setDeliveryDriverData] = useState(null)
  const [order, setOrder] = useState(null)
  const [isWaitingForOrders, setIsWaitingForOrders] = useState(false)
  const [routeId, setRouteId] = useState(null)

  const currentUser = useSelector(state => state.auth.user)

  const dispatch = useDispatch()

  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const [region, setRegion] = useState(null)
  const [routeCoordinates, setRouteCoordinates] = useState([])

  const positionWatchID = useRef(null)
  const apiManager = useRef(null)

  useLayoutEffect(() => {
    navigation.setOptions({
      title: localized('Home'),
      headerLeft: () => (
        <Hamburger
          onPress={() => {
            navigation.openDrawer()
          }}
        />
      ),
    })
  }, [])

  useEffect(() => {
    apiManager.current = new DriverAPIManager(config, onDriverUpdate, setOrder)

    return apiManager.current?.unsubscribe
  }, [])

  useEffect(() => {
    if (!currentUser?.id) {
      return
    }
    apiManager.current?.unsubscribe()
    apiManager.current?.subscribeToDriverDataUpdates(currentUser)
    setRegion({
      latitude: currentUser.location?.latitude,
      longitude: currentUser.location?.longitude,
      latitudeDelta: 0.00922,
      longitudeDelta: 0.00421,
    })
  }, [currentUser?.id])

  const onDriverUpdate = data => {
    const orderRequestData = data?.orderRequestData
    const inProgressOrderID = data?.inProgressOrderID
    setDeliveryDriverData({ orderRequestData, inProgressOrderID })
    if (!orderRequestData && !inProgressOrderID && data.isActive === true) {
      // Driver has no in-progress order, so they can go offline => enable button, show user location on map
      setIsWaitingForOrders(true)
      setRouteCoordinates([])
      setRouteId(null)
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity style={styles.logoutButton} onPress={goOffline}>
            <Image
              source={require('../../../assets/icons/shutdown.png')}
              style={styles.logoutButtonImage}
            />
          </TouchableOpacity>
        ),
      })
    } else {
      // Disable button, hide user location on map
      setIsWaitingForOrders(false)
      navigation.setOptions({
        headerRight: null,
      })
    }
    dispatch(setUserData({ user: data }))
  }

  useEffect(() => {
    console.log('positionWatchID')
    return () => {
      //positionWatchID != null && Geolocation.clearWatch(positionWatchID);
    }
  }, [positionWatchID])

  useEffect(() => {
    if (deliveryDriverData && deliveryDriverData.inProgressOrderID) {
      apiManager.current?.subscribeToOrder(deliveryDriverData.inProgressOrderID)
    }
  }, [deliveryDriverData])

  useEffect(() => {
    if (order && order?.status !== 'passenger_cancelled') {
      computePolylineCoordinates(order)
    } else {
      positionWatchID.current != null &&
        Geolocation.clearWatch(positionWatchID.current)
      setRouteCoordinates([])
      setRouteId(null)
    }
  }, [order?.status])

  useEffect(() => {
    Geolocation.clearWatch(positionWatchID.current)
    trackDriverLocation()
  }, [routeId])

  const goOnline = () => {
    apiManager.current?.goOnline(currentUser)
  }

  const goOffline = () => {
    apiManager.current?.goOffline(currentUser)
  }

  const onMessagePress = () => {
    const customerID = order.passenger && order.passenger?.id
    const viewerID = currentUser.id || currentUser.userID
    let channel = {
      id: viewerID < customerID ? viewerID + customerID : customerID + viewerID,
      participants: [order.passenger],
    }
    props.navigation.navigate('PersonalChat', { channel })
  }

  const emptyStateConfig = {
    title: localized("You're offline"),
    description: localized('Go online in order to start getting requests.'),
    buttonName: localized('Go Online'),
    onPress: goOnline,
  }

  const onAcceptNewOrder = () => {
    deliveryDriverData?.orderRequestData &&
      apiManager.current?.accept(
        deliveryDriverData.orderRequestData,
        currentUser,
      )
  }

  const onRejectNewOrder = () => {
    deliveryDriverData
    deliveryDriverData?.orderRequestData &&
      apiManager.current?.reject(
        deliveryDriverData.orderRequestData,
        currentUser,
      )
  }

  const computePolylineCoordinates = useCallback(order => {
    if (!order) {
      // invalid order
      return
    }
    const driver = currentUser
    const pickup = order.pickup
    const dropoff = order.dropoff

    if (order.status === 'driver_accepted' && pickup && driver) {
      // Driver has been allocated, and they're driving to pick up the order from the pickup location
      const sourceCoordinate = {
        latitude: driver.location?.latitude,
        longitude: driver.location?.longitude,
      }
      const destCoordinate = {
        latitude: pickup.latitude,
        longitude: pickup.longitude,
      }
      getDirections(
        sourceCoordinate,
        destCoordinate,
        config.googleMapsAPIKey,
        coordinates => {
          setRouteCoordinates(coordinates)
          const newRouteId = apiManager.current?.updateCurrentCoordinates(
            order,
            coordinates,
          )
          setRouteId(newRouteId)
        },
      )
      return
    }

    if (order.status === 'trip_started' && pickup && driver) {
      // Driver is heading to dropoff
      const sourceCoordinate = {
        latitude: driver.location?.latitude,
        longitude: driver.location?.longitude,
      }
      const destCoordinate = {
        latitude: dropoff.latitude,
        longitude: dropoff.longitude,
      }
      getDirections(
        sourceCoordinate,
        destCoordinate,
        config.googleMapsAPIKey,
        coordinates => {
          setRouteCoordinates(coordinates)
          if (!order?.coordinates) {
            const newRouteId = apiManager.current?.updateTripCoordinates(
              order,
              coordinates,
            )
            setRouteId(newRouteId)
          } else {
            const newRouteId = apiManager.current?.updateCurrentCoordinates(
              order,
              coordinates,
            )
            setRouteId(newRouteId)
          }
        },
      )
      return
    }
  })

  const renderMapElements = () => {
    if (!order || routeCoordinates.length < 2 || isWaitingForOrders) {
      return null
    }
    return (
      <>
        <Polyline coordinates={routeCoordinates} strokeWidth={5} />
        {order.driver !== undefined && (
          <Marker
            title={order.driver.firstName}
            coordinate={routeCoordinates[0]}
            style={styles.marker}>
            <Image
              source={require('../../../Core/delivery/assets/car-icon.png')}
              style={styles.mapCarIcon}
            />
          </Marker>
        )}
        {order.status === 'awaiting_driver' && order.pickup && (
          <Marker
            title={order.pickup?.title}
            coordinate={routeCoordinates[routeCoordinates.length - 1]}
            style={styles.marker}>
            <Image
              source={require('../../../Core/delivery/assets/destination-icon.png')}
              style={styles.mapCarIcon}
            />
          </Marker>
        )}

        {order.status === 'trip_started' && order.dropoff?.title && (
          <Marker
            title={order.dropoff?.title}
            coordinate={routeCoordinates[routeCoordinates.length - 1]}
            style={styles.marker}>
            <Image
              source={require('../../../Core/delivery/assets/destination-icon.png')}
              style={styles.mapCarIcon}
            />
          </Marker>
        )}
      </>
    )
  }

  const updatePolyline = location => {
    if (!order) {
      return
    }
    if (routeCoordinates.length < 2) {
      computePolylineCoordinates(order)

      return
    }
    console.log('updatePolyline2')
    const firstPoint = routeCoordinates[0]
    const distance = getDistance(
      firstPoint.latitude,
      firstPoint.longitude,
      location.latitude,
      location.longitude,
    )
    if (distance < 1) {
      const routeCoordinatesCopy = [...routeCoordinates]
      routeCoordinatesCopy.splice(0, 1)
      setRouteCoordinates(routeCoordinatesCopy)

      console.log('removed ')
    } else if (distance > 2) {
      console.log('updatePolyline3')

      // we need to reroute since driver took a wrong turn
      computePolylineCoordinates(order)
    }
  }

  const watchPosition = () => {
    return Geolocation.watchPosition(
      position => {
        const coords = position.coords
        const location = {
          heading: coords.heading,
          latitude: coords?.latitude,
          longitude: coords?.longitude,
        }
        dispatch(setUserData({ user: { ...currentUser, location } }))
        if (currentUser.inProgressOrderID) {
          apiManager.current?.updateCarDrive(order, location)
        } else {
          updateUser(currentUser.id, { location })
        }

        if (routeId) {
          updatePolyline(coords)
        }

        setRegion({
          latitude: coords?.latitude,
          longitude: coords?.longitude,
          latitudeDelta: 0.00922,
          longitudeDelta: 0.00421,
        })
      },
      () => {},
      { enableHighAccuracy: true },
    )
  }

  const handleAndroidLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: localized('Instamobile'),
          message: localized('Instamobile wants to access your location.'),
        },
      )

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        positionWatchID.current = watchPosition()
      } else {
        alert(
          localized(
            'Location permission denied. Turn on location to use the app.',
          ),
        )
      }
    } catch (err) {
      console.log(err)
    }
  }

  const trackDriverLocation = async () => {
    if (Platform.OS === 'ios') {
      positionWatchID.current = watchPosition()
    } else {
      handleAndroidLocationPermission()
    }
  }

  if (currentUser && !currentUser.isActive) {
    return (
      <View style={styles.inactiveViewContainer}>
        <TNEmptyStateView emptyStateConfig={emptyStateConfig} />
      </View>
    )
  }

  if (currentUser && currentUser.isActive === true) {
    return (
      <View style={styles.container}>
        <MapView
          initialRegion={region}
          showsUserLocation={isWaitingForOrders}
          provider={Platform.OS === 'ios' ? null : PROVIDER_GOOGLE}
          style={styles.mapStyle}>
          {renderMapElements()}
        </MapView>
        {deliveryDriverData?.orderRequestData && (
          <NewOrderRequestModal
            onAccept={onAcceptNewOrder}
            onReject={onRejectNewOrder}
            isVisible={deliveryDriverData?.orderRequestData !== undefined}
            onModalHide={onRejectNewOrder}
          />
        )}
        {order && currentUser.inProgressOrderID && (
          <OrderPreviewCard
            onMessagePress={onMessagePress}
            driver={currentUser}
            order={order}
          />
        )}
      </View>
    )
  }

  return null
}

HomeScreen.propTypes = {
  user: PropTypes.shape(),
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }),
}

export default HomeScreen
