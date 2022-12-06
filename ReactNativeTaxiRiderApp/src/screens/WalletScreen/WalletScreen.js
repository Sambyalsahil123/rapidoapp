import React, { useLayoutEffect, useEffect, useState, useRef } from 'react'
import { Alert, View, Text } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useTheme, useTranslations } from 'dopenative'
import { PaymentAPIManager } from '../../Core/api'
import { usePaymentRequest } from '../../Core/payment/api'
import { updatePaymentMethods, setSelectedPaymentMethod } from '../../redux'
import { setUserData } from '../../Core/onboarding/redux/auth'
import PaymentOptions from './PaymentOptions'
import dynamicStyles from './styles'
import MenuIcon from '../../components/MenuIcon/MenuIcon'
import { useConfig } from '../../config'
import { updateUser } from '../../Core/users'

export default function WalletScreen(props) {
  const { navigation, route } = props
  const canGoBack = route.params?.canGoBack

  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const dispatch = useDispatch()

  const config = useConfig()

  const currentUser = useSelector(state => state.auth.user)
  const paymentMethods = useSelector(({ payment }) => payment.paymentMethods)

  const { detachCustomerCard } = usePaymentRequest(config)

  const paymentMethodDataManager = useRef(new PaymentAPIManager(config))
  const stripeCustomerID = useRef(null)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: renderNavHeaderLeft,
      headerStyle: styles.navHeaderContainer,
    })
  }, [navigation])

  useEffect(() => {
    const unsubscribePaymentMethods =
      paymentMethodDataManager.current.subscribePaymentMethods(
        currentUser.id,
        setPaymentMethods,
      )

    return () => {
      unsubscribePaymentMethods && unsubscribePaymentMethods()
    }
  }, [])

  const renderNavHeaderLeft = () => {
    return (
      <MenuIcon
        source={canGoBack ? theme.icons.back : theme.icons.menu}
        onPress={onMenuIconPress}
      />
    )
  }

  const onMenuIconPress = () => {
    if (canGoBack) {
      navigation.goBack()
    } else {
      navigation.openDrawer()
    }
  }

  const onAddNewCard = () => {
    navigation.navigate('AddCard')
  }

  const setPaymentMethods = methods => {
    dispatch(updatePaymentMethods(methods))
  }

  const removeFromPaymentMethods = async method => {
    const result = await detachCustomerCard({
      paymentMethodId: method.id,
    })

    if (result.data?.succeeded) {
      onRemoveFromPaymentMethods(method)
      return
    }
    Alert.alert(localized('Error'), localized('Failed to remove card'))
  }

  const onRemoveFromPaymentMethods = method => {
    paymentMethodDataManager.current.deleteFromUserPaymentMethods(method.id)
    if (method.key === currentUser.defaultPaymentKey) {
      const newSelectedPayment = paymentMethods[0]
      dispatch(setSelectedPaymentMethod(paymentMethods[0]))
      updateUser(currentUser.id, {
        defaultPaymentKey: newSelectedPayment.key,
      })

      dispatch(
        setUserData({
          user: { ...currentUser, defaultPaymentKey: newSelectedPayment.key },
        }),
      )
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.optionsTitleContainer}>
        <Text style={styles.optionsTitle}>{localized('Payment Method')}</Text>
      </View>
      <PaymentOptions
        onAddNewCard={onAddNewCard}
        onPaymentMethodLongPress={removeFromPaymentMethods}
      />
    </View>
  )
}
