import React, { useState, useRef, useEffect } from 'react'
import { Alert, View } from 'react-native'
import { useSelector } from 'react-redux'
import { CardField, useConfirmSetupIntent } from '@stripe/stripe-react-native'
import Button from '../../components/Button/Button'
import { PaymentAPIManager } from '../../Core/api'
import { usePaymentRequest } from '../../Core/payment/api'
import { useConfig } from '../../config'
import { useTheme, useTranslations } from 'dopenative'
import dynamicStyles from './styles'

export default function AddCardScreen({ navigation }) {
  const currentUser = useSelector(state => state.auth.user)

  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const { localized } = useTranslations()

  const [loading, setLoading] = useState()

  const { confirmSetupIntent } = useConfirmSetupIntent()

  const config = useConfig()

  const { setupStripe } = usePaymentRequest(config)

  const paymentMethodDataManager = useRef(null)

  const stripeCustomerID = useRef(null)
  const cardDetails = useRef({})

  useEffect(() => {
    paymentMethodDataManager.current = new PaymentAPIManager(config)
  }, [])

  const createSetupIntentOnBackend = async () => {
    const {
      data: { clientSecret, customerId },
    } = await setupStripe(currentUser.email)
    stripeCustomerID.current = customerId

    return clientSecret
  }

  const onSavePress = async () => {
    if (!cardDetails.current?.complete) {
      Alert.alert(localized('Error'), localized('Please complete card details'))
      return
    }

    try {
      setLoading(true)

      // 1. Create setup intent on backend
      const clientSecret = await createSetupIntentOnBackend()

      // 2. Gather customer billing information (ex. email)
      // const billingDetails = {
      //   email: currentUser.email,
      //   phone: '+48888000888',
      //   addressCity: 'Houston',
      //   addressCountry: 'US',
      //   addressLine1: '1459  Circle Drive',
      //   addressLine2: 'Texas',
      //   addressPostalCode: '77063',
      // } // mocked data for tests

      // 3. Confirm setup intent
      const { error, setupIntent: setupIntentResult } =
        await confirmSetupIntent(clientSecret, {
          type: 'Card',
          // billingDetails,
        })

      setLoading(false)

      if (error) {
        Alert.alert(localized(`Error code: ${error.code}`), error.message)
        console.warn(
          localized('Setup intent confirmation error'),
          error.message,
        )
      } else if (setupIntentResult) {
        // setSetupIntent(setupIntentResult)

        Alert.alert(
          localized('Card Saved'),
          localized(`Card status: ${setupIntentResult.status}`),
          [
            {
              onPress: () => storePaymentMethod(setupIntentResult),
            },
          ],
        )
      }
    } catch (error) {
      Alert.alert(
        localized('Error'),
        localized('An error occured, please try again later'),
      )
      console.warn(error)
      setLoading(false)
    }
  }

  const storePaymentMethod = setupIntentResult => {
    const newPaymentMethod = {
      ...cardDetails.current,
      // clientSecret: setupIntentResult.clientSecret,
      created: setupIntentResult.created,
      description: setupIntentResult.description,
      id: setupIntentResult.paymentMethodId,
      paymentMethodId: setupIntentResult.paymentMethodId,
      paymentMethodTypes: setupIntentResult.paymentMethodTypes, // ["Card"],
      status: setupIntentResult.status,
      usage: setupIntentResult.usage,
      ownerId: currentUser.id,
    }
    paymentMethodDataManager.current.addUserPaymentMethod(newPaymentMethod)

    navigation.goBack()
  }

  const onCardChange = details => {
    cardDetails.current = details //{"brand": "Visa", "complete": true, "expiryMonth": 4, "expiryYear": 24, "last4": "4242"}
  }

  return (
    <View style={styles.container}>
      <CardField
        postalCodeEnabled={false}
        onCardChange={onCardChange}
        style={styles.cardField}
      />
      <View style={styles.buttonContainer}>
        <Button
          variant="primary"
          onPress={onSavePress}
          title={localized('Save')}
          loading={loading}
        />
      </View>
    </View>
  )
}
