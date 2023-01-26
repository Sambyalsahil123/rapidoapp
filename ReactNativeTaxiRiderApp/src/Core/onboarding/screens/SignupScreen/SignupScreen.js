import React, { useState } from 'react'
import {
  Alert,
  Image,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import axios from 'axios'
import Button from 'react-native-button'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useTheme, useTranslations } from 'dopenative'
import dynamicStyles from './styles'
import TNActivityIndicator from '../../../truly-native/TNActivityIndicator'
import TNProfilePictureSelector from '../../../truly-native/TNProfilePictureSelector/TNProfilePictureSelector'
import TermsOfUseView from '../../components/TermsOfUseView'
import { useOnboardingConfig } from '../../hooks/useOnboardingConfig'
import { useAuth } from '../../hooks/useAuth'
import { OTPVerificationModal } from '../SmsAuthenticationScreen/OTPVerificationModal'
import { checkFields, trimFields } from '../../utils/signup'

const SignupScreen = props => {
  const { navigation } = props
  const authManager = useAuth()
  const [verificationModal, setVerificationModal] = useState(false)
  const [structuredData, setStructuredData] = useState({})

  const { config } = useOnboardingConfig()
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const [inputFields, setInputFields] = useState({})

  const [profilePictureFile, setProfilePictureFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const onRegister = async () => {
    const areFiedsTrue = checkFields(inputFields, profilePictureFile, localized)

    if (!areFiedsTrue) {
      return
    }
    setLoading(true)

    const userDetails = {
      ////// SEND CUSTOMER DATA IN DB
      ...trimFields(inputFields),
      profilePictureURL: profilePictureFile?.uri,
      appIdentifier: config.appIdentifier,
    }

    if (userDetails.username) {
      userDetails.username = userDetails.username?.toLowerCase()
    }

    setStructuredData(userDetails)

    const sendOTPforCustomer =
      'https://us-central1-bega-370917.cloudfunctions.net/sendOTPforCustomer'

    Keyboard.dismiss()

    const setValues = () => {
      setLoading(false)
      setVerificationModal(true)
    }
    const phoneLength = inputFields.contactNumber.length

    const restructuredPhoneNumber = `${
      phoneLength === 13
        ? inputFields.contactNumber
        : '000' + inputFields.contactNumber
    }`.slice(3, 13)

    try {
      const response = await axios.post(sendOTPforCustomer, {
        contactNumber: Number(restructuredPhoneNumber),
      })

      if (response?.data?.success) {
        setLoading(false)
        return setValues()
      }

      if (response?.data?.error) {
        alert(response?.data?.error)
        setLoading(false)
      }
      setLoading(false)
    } catch (error) {
      alert('Something went wrong, please try again later')
      setLoading(false)
      return
    }
  }

  const onChangeInputFields = (text, key) => {
    setInputFields(prevFields => ({
      ...prevFields,
      [key]: text,
    }))
  }

  const renderInputField = (field, index) => {
    return (
      <TextInput
        maxLength={field.maxLength}
        key={index?.toString()}
        style={styles.InputContainer}
        placeholder={field.placeholder}
        placeholderTextColor="#aaaaaa"
        secureTextEntry={field.secureTextEntry}
        onChangeText={text => onChangeInputFields(text, field.key)}
        value={inputFields[field.key]}
        keyboardType={field.type}
        underlineColorAndroid="transparent"
        autoCapitalize={field.autoCapitalize}
      />
    )
  }

  const renderSignUpWithPhoneNumber = () => {
    return (
      <>
        {config.signupFields.map(renderInputField)}
        <Button
          containerStyle={styles.signupContainer}
          style={styles.signupText}
          onPress={() => onRegister()}>
          {localized('Send OTP')}
        </Button>
      </>
    )
  }

  return (
    <>
      {verificationModal && (
        <OTPVerificationModal inputFields={structuredData} />
      )}
      <View style={styles.container}>
        <KeyboardAwareScrollView
          style={{ flex: 1, width: '100%' }}
          keyboardShouldPersistTaps="always">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              style={styles.backArrowStyle}
              source={theme.icons.backArrow}
            />
          </TouchableOpacity>
          <Text style={styles.title}>{localized('Create new account')}</Text>
          <TNProfilePictureSelector
            setProfilePictureFile={setProfilePictureFile}
          />
          {renderSignUpWithPhoneNumber()}

          <TermsOfUseView
            tosLink={config.tosLink}
            privacyPolicyLink={config.privacyPolicyLink}
            style={styles.tos}
          />
        </KeyboardAwareScrollView>
        {loading && <TNActivityIndicator />}
      </View>
    </>
  )
}

export default SignupScreen
