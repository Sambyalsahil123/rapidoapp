import React, { useState } from 'react'
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
} from 'react-native'
import Button from 'react-native-button'
import { Button as LogInButton } from 'react-native-elements'
import { useTheme, useTranslations } from 'dopenative'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import TNActivityIndicator from '../../../truly-native/TNActivityIndicator'
import dynamicStyles from './styles'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage'
import { setUserData } from '../../redux/auth'

const LoginScreen = props => {
  const { navigation } = props
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const [loading, setLoading] = useState(false)
  const [contactNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [parameters, setParameters] = useState({
    isOTPSent: false,
    isPhoneNumberInvalid: false,
    isOTPInvalid: false,
  })



  const styles = dynamicStyles(theme, appearance)
  const dispatch = useDispatch()

  const onPressLogin = async () => {
    const phoneLength = contactNumber.length

    if (!(phoneLength > 13 || phoneLength < 10)) {
      if (phoneLength === 10 || phoneLength === 13) {
        const restructuredPhoneNumber = `${
          phoneLength === 13 ? contactNumber : '000' + contactNumber
        }`.slice(3, 13)

        const loginAsCustomer =
          'https://us-central1-bega-370917.cloudfunctions.net/loginAsCustomer'

        try {
          setLoading(true)
          const response = await axios.post(loginAsCustomer, {
            contactNumber: Number(restructuredPhoneNumber.trim()),
          })

          if (response.data.error) {
            setLoading(false)
            setParameters({ ...parameters, isOTPSent: false })
           
            Alert.alert(
              '',
              localized(response.data.error),
              [{ text: localized('OK') }],
              {
                cancelable: false,
              },
            )
            return
          } else if (response.data.success) {
            setLoading(false)
            setParameters({ isPhoneNumberInvalid: true })
            setParameters({ ...parameters, isOTPSent: true })
            
          }
        } catch (error) {
          setLoading(false)
          alert(error)
          return
        }
        return
      }
    } else {
      setLoading(false)
      setParameters({ ...parameters, isPhoneNumberInvalid: true })
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    AsyncStorage.clear()
    const confirmOTPforCustomer =
      'https://us-central1-bega-370917.cloudfunctions.net/confirmOTPforCustomer'

    if (otp.length !== 4) {
      setParameters({ ...parameters, isOTPInvalid: true })
      setLoading(false)
      return
    }

    const phoneLength = contactNumber.length

    const restructuredPhoneNumber = `${
      phoneLength === 13 ? contactNumber : '000' + contactNumber
    }`.slice(3, 13)

    try {
      const response = await axios.post(confirmOTPforCustomer, {
        contactNumber: Number(restructuredPhoneNumber.trim()),
        otp: Number(otp.trim()),
        isFromLoginPage: true,
      })

      if (response.data.success) {
        const user = response?.data?.userData
        // AsyncStorage.setItem('userData', JSON.stringify(response.data.userData))
        // console.log(response.data.userData.id, 'newDATA')
        dispatch(setUserData({ user }))
        setLoading(false)
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainStack', params: { user } }],
        })
        return
      } else if (response.data.error) {
        Alert.alert(
          '',
          localized(response.data.error),
          [{ text: localized('OK') }],
          {
            cancelable: false,
          },
        )
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      alert(response.data.error)
    }
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: '100%' }}
        keyboardShouldPersistTaps="always">
        <TouchableOpacity
          style={{ alignSelf: 'flex-start' }}
          onPress={() => navigation.goBack()}>
          <Image style={styles.backArrowStyle} source={theme.icons.backArrow} />
        </TouchableOpacity>
        <Text style={styles.title}>{localized('Log In')}</Text>
        <TextInput
          maxLength={12}
          style={styles.InputContainer}
          placeholder={localized('Phone Number')}
          keyboardType="phone-pad"
          placeholderTextColor="#aaaaaa"
          onChangeText={text => {
            setPhoneNumber(text)
            setParameters({ ...parameters, isPhoneNumberInvalid: false })
          }}
          value={contactNumber}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />

        {parameters.isPhoneNumberInvalid ? (
          <Text style={externalStyle.error}>
            Please Enter Valid Phone Number
          </Text>
        ) : (
          ''
        )}

        <Button
          containerStyle={styles.loginContainer}
          style={styles.loginText}
          onPress={() => onPressLogin()}>
          {localized(!parameters.isOTPSent ? 'Send OTP' : 'Resend')}
        </Button>

        {loading && <TNActivityIndicator />}

        {parameters?.isOTPSent && (
          <View style={externalStyle.viewContainer}>
            <TextInput
              style={{
                ...externalStyle.textField,
                borderColor: otp.length === 4 ? '#515352' : 'gray',
                borderWidth: otp.length === 4 ? 2 : 1,
                // borderColor:response.data.error? "red":gray
              }}
              autoFocus
              value={otp}
              keyboardType="number-pad"
              maxLength={4}
              onChangeText={text => {
                setOtp(text)
                setParameters({ ...parameters, isOTPInvalid: false })
              }}
              placeholder="Enter OTP"
            />
            {parameters.isOTPInvalid && (
              <Text style={externalStyle.error}>Please Enter Valid OTP</Text>
            )}
            <LogInButton
              containerStyle={externalStyle.submitButton}
              buttonStyle={externalStyle.submitButtonStyle}
              titleStyle={externalStyle.submitTitle}
              title="Log In"
              onPress={() => handleSubmit()}
            />
          </View>
        )}
      </KeyboardAwareScrollView>
    </View>
  )
}

export default LoginScreen

const externalStyle = StyleSheet.create({
  viewContainer: {
    padding: 20,
    alignItems: 'center',
    height: '100%',
    width: '100%',
    alignSelf: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  textField: {
    width: '60%',
    padding: 20,
    marginBottom: 20,
    fontWeight: 'bold',
    fontSize: 24,
    letterSpacing: 4,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'gray',
    textAlign: 'center',
    color: 'gray',
  },
  submitButton: {
    width: '40%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: 10,
    height: 50,
    backgroundColor: 'gray',
  },
  submitButtonStyle: {
    backgroundColor: 'gray',
  },
  submitTitle: {
    color: 'white',
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
  },
  error: {
    padding: 10,
    color: 'red',
    textAlign: 'center',
    alignSelf: 'center',
    width: '100%',
  },
})
