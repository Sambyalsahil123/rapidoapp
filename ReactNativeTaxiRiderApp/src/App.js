import 'react-native-gesture-handler'
import React, { useEffect } from 'react'
import { LogBox, PermissionsAndroid, Platform } from 'react-native'
import { StripeProvider } from '@stripe/stripe-react-native'
import { Provider } from 'react-redux'
import Geolocation from '@react-native-community/geolocation'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { enableScreens } from 'react-native-screens'
import { extendTheme, DNProvider, TranslationProvider } from 'dopenative'
import configureStore from './redux/store'
import AppContent from './AppContent'
import translations from './translations'
import { ConfigProvider } from './config'
import { AuthProvider } from './Core/onboarding/hooks/useAuth'
import { ProfileAuthProvider } from './Core/profile/hooks/useProfileAuth'
import { authManager } from './Core/onboarding/api'
import InstamobileTheme from './theme'
import stripeConfig from './stripeConfig'

navigator.geolocation = require('@react-native-community/geolocation')
const store = configureStore()

const App = () => {
  const theme = extendTheme(InstamobileTheme)

  useEffect(() => {
    enableScreens()
    LogBox.ignoreAllLogs(true)
  }, [])

  useEffect(() => {
    if (Platform.OS === 'android') {
      androidPermissions()
    } else {
      // IOS
      Geolocation.requestAuthorization()
    }
  }, [])

  const androidPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Enable Location Services',
          message:
            'Our app needs access to your location ' +
            'so you can take awesome rides.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location')
      } else {
        console.log(
          'Location permission denied. The app cannot be used unless you enable location services.',
        )
      }
    } catch (err) {
      console.warn(err)
    }
  }

  return (
    <Provider store={store}>
      <TranslationProvider translations={translations}>
        <DNProvider theme={theme}>
          <ConfigProvider>
            <AuthProvider authManager={authManager}>
              <ProfileAuthProvider authManager={authManager}>
                <BottomSheetModalProvider>
                  <StripeProvider
                    publishableKey={stripeConfig.PUBLISHABLE_KEY}
                    merchantIdentifier={stripeConfig.MERCHANT_ID}>
                    <AppContent />
                  </StripeProvider>
                </BottomSheetModalProvider>
              </ProfileAuthProvider>
            </AuthProvider>
          </ConfigProvider>
        </DNProvider>
      </TranslationProvider>
    </Provider>
  )
}

export default App
