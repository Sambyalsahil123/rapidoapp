import React, { useEffect, useState } from 'react'
import { Text, View, TouchableOpacity, Alert } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useTheme, useTranslations } from 'dopenative'
import dynamicStyles from './styles'
import { setSelectedPaymentMethod } from '../../redux'
import PaymentOptionItem from '../../components/PaymentOptionItem/PaymentOptionItem'
import { setUserData } from '../../Core/onboarding/redux/auth'
import { updateUser } from '../../Core/users'

function PaymentOptions(props) {
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const { onAddNewCard, onPaymentMethodLongPress } = props

  const dispatch = useDispatch()
  const paymentMethods = useSelector(({ payment }) => payment.paymentMethods)
  const selectedPaymentMethod = useSelector(
    ({ payment }) => payment.selectedPaymentMethod,
  )
  const currentUser = useSelector(({ auth }) => auth.user)

  const [selectedMethodIndex, setSelectedMethodIndex] = useState(0)

  useEffect(() => {
    if (paymentMethods?.length > 0 && selectedPaymentMethod) {
      const selectedIndex = paymentMethods.findIndex(
        paymentMethod => paymentMethod.key === selectedPaymentMethod.key,
      )

      if (selectedIndex > -1) {
        setSelectedMethodIndex(selectedIndex)
        return
      }
    }
  }, [selectedPaymentMethod])

  const onPaymentMethodPress = (index, item) => {
    setSelectedMethodIndex(index)
    dispatch(setSelectedPaymentMethod(item))
    updateUser(currentUser.id, {
      defaultPaymentKey: item.key,
    })

    dispatch(
      setUserData({
        user: { ...currentUser, defaultPaymentKey: item.key },
      }),
    )
  }

  const onLongPress = method => {
    if (method?.key === 'cash') return

    Alert.alert(
      localized('Remove card'),
      localized('This card will be removed from payment methods.'),
      [
        {
          text: localized('Remove'),
          onPress: () => onPaymentMethodLongPress(method),
          style: 'destructive',
        },
        {
          text: localized('Cancel'),
        },
      ],
      { cancelable: true },
    )
  }

  const renderCard = (item, index) => {
    const isLastItem = index === paymentMethods.length - 1
    return (
      <PaymentOptionItem
        key={`${item?.key ?? index}`}
        index={index}
        isLastItem={isLastItem}
        selectedMethodIndex={selectedMethodIndex}
        item={item}
        onPress={onPaymentMethodPress}
        onLongPress={onLongPress}
        selectedIconSource={theme.icons.tick}
      />
    )
  }

  return (
    <>
      <View style={styles.optionsContainer}>
        {paymentMethods.map(renderCard)}
      </View>
      <TouchableOpacity
        onPress={onAddNewCard}
        style={styles.paymentMethodContainer}>
        <View style={styles.addNewCardTitleContainer}>
          <Text style={styles.addNewCardTitle}>
            {localized('Add payment method')}
          </Text>
        </View>
      </TouchableOpacity>
    </>
  )
}

export default PaymentOptions
