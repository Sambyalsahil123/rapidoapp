import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/core'
import { View, Pressable, Text } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import { useTheme, useTranslations } from 'dopenative'
import PaymentOptionItem from '../PaymentOptionItem/PaymentOptionItem'
import dynamicStyles, {
  bottomContainerHeight,
  altBottomContainerHeight,
} from './styles'
import { getCarType } from '../../utils'
import { Alert } from 'react-native'

export default function BottomButton({ isVisible }) {
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const { bottom } = useSafeAreaInsets()
  const navigation = useNavigation()

  const bottomSheetSnapPoints = useSelector(
    ({ bottomSheet }) => bottomSheet.bottomSheetSnapPoints,
  )
  const origin = useSelector(({ trip }) => trip.origin)
  const selectedPaymentMethod = useSelector(
    ({ payment }) => payment.selectedPaymentMethod,
  )
  const ride = useSelector(({ trip }) => trip.ride)
  const carType = ride?.type

  const [canChooseWallet, setCanChooseWallet] = useState(true)
  const [buttonTitle, setButtonTitle] = useState()

  const buttonTitles = {
    ride_detail: 'Next',
    ride_types: 'Confirm Uber',
    confirm_pickup: 'Confirm Pickup',
  }

  useEffect(() => {
    const sheetKey = bottomSheetSnapPoints.key
    if (!buttonTitles[sheetKey]) {
      setButtonTitle()
      return
    }

    let title = buttonTitles[sheetKey]

    if (sheetKey === 'ride_types' && carType) {
      title = `Confirm ${getCarType(carType)}`
    }

    if (sheetKey === 'confirm_pickup') {
      setCanChooseWallet(false)
    } else {
      setCanChooseWallet(true)
    }
    setButtonTitle(title)
  }, [bottomSheetSnapPoints.key, carType])

  const confirmPickup = () => {
    navigation.navigate('ConfirmPickupSheet')
  }

  const confirmRide = () => {
    if (!origin?.latitude) {
      Alert.alert(
        localized('Confirm Pickup'),
        localized('Please choose a pickup location'),
      )
      return
    }
    setCanChooseWallet(false)
    setButtonTitle()
    navigation.navigate('ConfirmRideSheet')
  }

  const buttonMethods = {
    ride_detail: confirmPickup,
    ride_types: confirmPickup,
    confirm_pickup: confirmRide,
  }

  const onButtonPress = () => {
    if (buttonMethods[bottomSheetSnapPoints.key]) {
      buttonMethods[bottomSheetSnapPoints.key]()
    }
  }

  const onPaymentMethodPress = () => {
    navigation.navigate('ChooseWallet', { canGoBack: true })
  }

  if (!isVisible || (!canChooseWallet && !buttonTitle)) {
    return null
  }

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: bottom,
          height: canChooseWallet
            ? bottomContainerHeight
            : altBottomContainerHeight,
        },
      ]}>
      {canChooseWallet && (
        <PaymentOptionItem
          item={selectedPaymentMethod}
          onPress={onPaymentMethodPress}
          selectedIconSource={theme.icons.rightArrow}
          isLastItem={true}
        />
      )}
      {buttonTitle && (
        <Pressable style={styles.buttonContainer} onPress={onButtonPress}>
          <Text style={styles.title}>{buttonTitle}</Text>
        </Pressable>
      )}
    </View>
  )
}
