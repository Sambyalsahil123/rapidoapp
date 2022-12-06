import React, { useState } from 'react'
import { Alert, Text, TouchableOpacity, View } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useTheme, useTranslations } from 'dopenative'
import { TNCard, TNActivityIndicator } from '../../../Core/truly-native'
import dynamicStyles from './styles'
import { DriverAPIManager } from '../../api/driver'
import { setUserData } from '../../../Core/onboarding/redux/auth'
import { useConfig } from '../../../config'
import { useEffect } from 'react'

const OrderPreviewCard = ({ order, driver, onMessagePress }) => {
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const config = useConfig()

  const dispatch = useDispatch()
  const currentUser = useSelector(state => state.auth.user)

  const [loading, setLoading] = useState(false)

  const apiManager = useRef(null)

  const buttonTitle =
    order.status === 'driver_accepted'
      ? localized('Start Trip')
      : localized('Complete Trip')
  const headlineText =
    order.status === 'driver_accepted'
      ? localized('Picking up - ') +
        order?.passenger?.firstName +
        ' ' +
        order?.passenger?.lastName
      : localized('Heading to ') + order?.dropoff?.title
  const address =
    order.status === 'driver_accepted' ? order?.dropoff?.title : ''

  useEffect(() => {
    apiManager.current = new DriverAPIManager(config)
  }, [])

  const onPress = () => {
    if (order.status === 'driver_accepted') {
      // Passenger has been picked up, so we update the status
      apiManager.current?.markAsPickedUp(order)
    } else {
      completeTrip()
    }
  }

  const completeTrip = async () => {
    setLoading(true)
    let title = 'Unable to complete trip'
    let description =
      'An error occured while trying to complete trip. Please try again.'
    const rs = await apiManager.current?.markAsCompleted(order, driver)

    if (!rs.isPaymentCompleted && rs.price) {
      title = 'Trip completed'
      description = `You will receive the amout of ${config.currency?.toUpperCase()}${
        rs.price
      } for the trip fare`
    }

    if (rs.isPaymentCompleted && rs.price) {
      title = 'Charged Successfully'
      description = `The cost of the trip is ${config.currency?.toUpperCase()}${
        rs.price
      } and the payment was successfully charged.`
    }

    if (rs.price) {
      dispatch(
        setUserData({ user: { ...currentUser, inProgressOrderID: null } }),
      )
    }

    Alert.alert(localized(title), localized(description), [
      { text: 'Ok', onPress: () => setLoading(false) },
    ])
  }

  return (
    <>
      <TNCard containerStyle={styles.container}>
        <View style={styles.contentView}>
          <View style={styles.textContainer}>
            <Text style={styles.headline}>{headlineText}</Text>
            <Text style={styles.description}>
              {localized('Order #')}
              {order.id}
            </Text>
            <Text style={styles.description}>{address}</Text>
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.actionButtonContainer}
              onPress={onPress}>
              <Text style={styles.actionButtonText}>{buttonTitle}</Text>
            </TouchableOpacity>
            {order.status !== 'awaiting_driver' && (
              <TouchableOpacity
                style={styles.secondaryButtonContainer}
                onPress={onMessagePress}>
                <Text style={styles.secondaryButtonText}>
                  {localized('Message')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TNCard>
      {loading && <TNActivityIndicator />}
    </>
  )
}

export default OrderPreviewCard
