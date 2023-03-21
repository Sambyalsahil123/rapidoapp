import React, { useState } from 'react'
import {
  View,
  TextInput,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native'
import { Button } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import dynamicStyles from './styles'
import { useTheme } from 'dopenative'
import axios from 'axios'
import TNActivityIndicator from '../../../truly-native/TNActivityIndicator'
import { useDispatch } from 'react-redux'
import { setUserData } from '../../redux/auth'
import { firebase } from '@react-native-firebase/firestore'
export const OTPVerificationModal = ({ inputFields }) => {
  const navigation = useNavigation()
  const [otp, setOtp] = useState('')
  const { theme, appearance } = useTheme()
  const [loading, setLoading] = useState(false)
  const usersRef = firebase.firestore().collection('users')

  const [parameters, setParameters] = useState({
    // isOTPSent: false,
    isOTPInvalid: false,
  })

  const Customstyles = dynamicStyles(theme, appearance)

  const dispatch = useDispatch()

  const handleSubmit = async () => {
    setLoading(true)
    const confirmOTPUrl =
      'https://us-central1-bega-370917.cloudfunctions.net/confirmOTP'

    if (otp?.length !== 4) {
      setParameters({ isOTPInvalid: true })
      setLoading(false)
      return
    }

    const phoneLength = inputFields?.phoneNumber?.length

    const restructuredPhoneNumber = `${
      phoneLength === 13
        ? inputFields.phoneNumber
        : '000' + inputFields?.phoneNumber
    }`.slice(3, 13)

    try {
      setLoading(true)
      
      const res = await axios.post(confirmOTPUrl, {
        ...inputFields,
        otp: Number(otp.trim()),
        phoneNumber: Number(restructuredPhoneNumber.trim()),
        IsApproved: false,
        isActive: false,
        location: {
          heading: 0,
          latitude: 37.310212191697715,
          longitude: -121.95864486694336,
        },
      })
      // navigation?.navigate('MainStack', {})
      console.log(res.data.success, res.data)
      // setParameters({ isOTPInvalid: true })
      if (res.data.success) {
        // navigation?.navigate('MainStack', {})
        Alert.alert(
          '',
          'Your registration is under process, please wait for 24 hours',
        )

        const upDatedUser = await usersRef.doc().get()

        // console.log(upDatedUser._data, 'this is UPDATE USER')
        // dispatch(setUserData({ user: upDatedUser._data }))
        navigation.navigate('LoginStack', { screen: 'Welcome' })

        dispatch(setUserData({ user: inputFields }))
        return
        // navigation.navigate('LoginStack', {
        //   screen: 'Login',
        // })
      } else {
        console.log(res?.data?.error, 'this is err')
        throw new Error(res?.data?.error)
      }
    } catch (error) {
      alert(error)
      setParameters({ isOTPInvalid: true })
      setLoading(false)
    }
  }

  return (
    <Modal animationType="slide" transparent={false}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('LoginStack', {
            screen: 'Signup',
          })
        }>
        <Image
          style={Customstyles.backArrowStyle}
          source={theme.icons.backArrow}
        />
      </TouchableOpacity>

      <View style={styles.viewContainer}>
        <TextInput
          style={{
            ...styles.textField,
            borderColor: otp?.length === 4 ? '#515352' : 'gray',
            borderWidth: otp?.length === 4 ? 2 : 1,
          }}
          autoFocus
          value={otp}
          keyboardType="number-pad"
          maxLength={4}
          onChangeText={text => {
            setOtp(text)
            setParameters({ isOTPInvalid: false })
          }}
          placeholder="Enter OTP"
        />

        {parameters.isOTPInvalid && (
          <Text style={styles.error}>Please Enter Valid OTP</Text>
        )}

        {/* 
        <Button
          containerStyle={styles.loginContainer}
          style={styles.loginText}
          onPress={() => onRegister()}>
          {localized(!parameters.isOTPSent ? 'Send OTP' : 'Resend')}
        </Button> */}

        <Button
          containerStyle={styles.submitButton}
          buttonStyle={styles.submitButtonStyle}
          titleStyle={styles.submitTitle}
          title="Submit"
          onPress={() => handleSubmit()}
        />
      </View>
      {loading && <TNActivityIndicator />}
    </Modal>
  )
}

const styles = StyleSheet.create({
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
  },
})
