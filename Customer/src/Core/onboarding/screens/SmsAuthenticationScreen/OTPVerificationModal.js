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

export const OTPVerificationModal = ({ inputFields }) => {
  const navigation = useNavigation()
  const [otp, setOtp] = useState('')
  const { theme, appearance } = useTheme()
  const [loading, setLoading] = useState(false)

  const [parameters, setParameters] = useState({
    // isOTPSent: false,
    isOTPInvalid: false,
  })

  const Customstyles = dynamicStyles(theme, appearance)

  const dispatch = useDispatch()

  const handleSubmit = async () => {
    setLoading(true)
    const confirmOTPforCustomer =
      'https://us-central1-bega-370917.cloudfunctions.net/confirmOTPforCustomer'

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
      const res = await axios.post(confirmOTPforCustomer, {
        ...inputFields,
        otp: Number(otp.trim()),
        phoneNumber: Number(restructuredPhoneNumber.trim()),
      })
      
      console.log(res.data.success, res.data)

      if (res.data.success) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainStack', params: { user: inputFields } }],
        })

        dispatch(setUserData({ user: inputFields }))
        
        return
      } else {
        setLoading(false)
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

        <Button
          containerStyle={styles.submitButton}
          buttonStyle={styles.submitButtonStyle}
          titleStyle={styles.submitTitle}
          title="Login"
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
