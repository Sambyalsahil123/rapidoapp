import React, { useState } from 'react'
import {
  Alert,
  Image,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native'
import axios from 'axios'
import Button from 'react-native-button'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useDispatch } from 'react-redux'
import { useTheme, useTranslations } from 'dopenative'
import dynamicStyles from './styles'
import TNActivityIndicator from '../../../truly-native/TNActivityIndicator'
import TNProfilePictureSelector from '../../../truly-native/TNProfilePictureSelector/TNProfilePictureSelector'
import { setUserData } from '../../redux/auth'
import TermsOfUseView from '../../components/TermsOfUseView'
import { useOnboardingConfig } from '../../hooks/useOnboardingConfig'
import { useAuth } from '../../hooks/useAuth'
import SignupOnBoard from './SignupOnboard'
import SignupOnboardImg from './SignOnboardImg'
import Img from './upload.png'
import { OTPVerificationModal } from '../SmsAuthenticationScreen/OTPVerificationModal'
import storage from '@react-native-firebase/storage'

const SignupScreen = props => {

  const [modalVisible, setModalVisible] = useState(false)
  const { navigation } = props
  // const dispatch = useDispatch()
  const { config } = useOnboardingConfig()
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)
  const [inputFields, setInputFields] = useState({})
  const [structuredData, setStructuredData] = useState({})
  const [profilePictureFile, setProfilePictureFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [verificationModal, setVerificationModal] = useState(false)
  const [documentUrls, setDocumentUrls] = useState({})
  const [throwDocsErr, setThrowDocsErr] = useState(false)
  const referenceCreator = storage()
  const [driverDocuments, setDriverDocuments] = useState({
    backImage: null,
    frontImage: null,
    rcImg: null,
    vehicleInsuranceImg: null,
  })

  ////// UPLOAD IMAGES TO FIRESTORE

  const uploadDocs = () => {
    setLoading(true)
    const allData = {
      profilePhoto: profilePictureFile.uri,
      User_Front_Image_Of_Driving_License: driverDocuments?.backImage,
      User_Back_Image_Of_Driving_License: driverDocuments?.frontImage,
      User_RC_Image: driverDocuments?.rcImg,
      User_Vehicle_Insurance_Image: driverDocuments?.vehicleInsuranceImg,
    }
    if (Object.values(allData).every(Boolean)) {
      setLoading(false)
      uploadImage()
    } else {
      setLoading(false)
      Alert.alert('', 'Please upload all required documents')
    }
  }

  const validateAadhar = text => {
    const reg = new RegExp(
      /(^[0-9]{4}[0-9]{4}[0-9]{4}$)|(^[0-9]{4}\s[0-9]{4}\s[0-9]{4}$)|(^[0-9]{4}-[0-9]{4}-[0-9]{4}$)/,
    )
    return reg.test(text) ? true : false
  }
  const validatePhoneNumber = text => {
    let reg = /^(\+\d{1,3}[- ]?)?\d{10}$/
    return reg.test(text) ? true : false
  }

  const trimFields = fields => {
    var trimmedFields = {}
    Object.keys(fields).forEach(key => {
      if (fields[key]) {
        trimmedFields[key] = fields[key].trim()
      }
    })
    return trimmedFields
  }

  const uploadImage = async () => {
    setLoading(true)
    const allData = {
      profilePhoto: profilePictureFile.uri,
      User_Front_Image_Of_Driving_License: driverDocuments?.backImage,
      User_Back_Image_Of_Driving_License: driverDocuments?.frontImage,
      User_RC_Image: driverDocuments?.rcImg,
      User_Vehicle_Insurance_Image: driverDocuments?.vehicleInsuranceImg,
    }
    // this folder name is made up of first 3 letters of firstname and last 4 digit of phone number
    const generatedFolderName = `${inputFields.firstName.slice(
      0,
      3,
    )}${inputFields.phoneNumber.slice(-4)}`

    const stateObj = {}
    for (const [key, value] of Object.entries(allData)) {
      if (value !== null) {
        const reference = referenceCreator.ref(
          `User Data/${generatedFolderName}/${key}`,
        )

        try {
          await reference.putFile(value)
          const url = await storage()
            .ref(`User Data/${generatedFolderName}/${key}`)
            .getDownloadURL()
          stateObj[key] = url
        } catch (error) {
          setLoading(false)
          Alert.alert('', 'Something went wrong, please try again')
        }
      }
    }
    setDocumentUrls(stateObj)
    setThrowDocsErr(false)
    setModalVisible(!modalVisible)
    setLoading(false)
  }

  const checkFields = () => {
    if (
      !(
        inputFields?.carModel &&
        inputFields?.carPlate &&
        inputFields?.lastName &&
        inputFields?.firstName
      )
    ) {
      Alert.alert(
        '',
        localized('All fields are required!'),
        [{ text: localized('OK') }],
        {
          cancelable: false,
        },
      )
      return false
    }

    if (!validateAadhar(inputFields?.aadharCard?.trim())) {
      Alert.alert(
        '',
        localized('Please enter a valid  Aadhar Number.'),
        [{ text: localized('OK') }],
        {
          cancelable: false,
        },
      )
      return false
    }

    if (!validatePhoneNumber(inputFields?.phoneNumber?.trim())) {
      Alert.alert(
        '',
        localized('Please enter a valid  Phone Number.'),
        [{ text: localized('OK') }],
        {
          cancelable: false,
        },
      )
      return false
    }
    if (!profilePictureFile) {
      Alert.alert(
        '',
        localized('Please upload a Profile Picture'),
        [{ text: localized('OK') }],
        {
          cancelable: false,
        },
      )
      return false
    }
    return true
  }

  const onRegister = async () => {
    const areFiedsTrue = checkFields()

    if (!areFiedsTrue) {
      return
    }

    setLoading(true)

    const userDetails = {
      ////// SEND USER SIGUP DATA IN DB
      photoFile: documentUrls.profilePhoto,
      ...trimFields(inputFields),
      appIdentifier: config.appIdentifier,
      images: documentUrls,
    }

    if (userDetails.username) {
      userDetails.username = userDetails.username?.toLowerCase()
    }

    const getUrlsOfDocument = Object.values(documentUrls)

    if (
      getUrlsOfDocument.includes(null) ||
      getUrlsOfDocument.length < 5 ||
      !profilePictureFile
    ) {
      setLoading(false)
      setThrowDocsErr(true)
      return
    }

    setStructuredData(userDetails)

    // dispatch(setUserData({ user }))

    const otpEndPoint =
      'https://us-central1-bega-370917.cloudfunctions.net/sendOTP'

    Keyboard.dismiss()

    const setValues = () => {
      setLoading(false)
      setVerificationModal(true)
    }
    const phoneLength = inputFields.phoneNumber.length

    const restructuredPhoneNumber = `${
      phoneLength === 13
        ? inputFields.phoneNumber
        : '000' + inputFields.phoneNumber
    }`.slice(3, 13)

    try {
      const response = await axios.post(otpEndPoint, {
        phoneNumber: Number(restructuredPhoneNumber),
      })

      if (response.data.success) {
        setLoading(false)

        return setValues()
      }

      if (response?.data?.error) {
        alert(response?.data?.error)
        setLoading(false)
      }

      setLoading(false)
    } catch (error) {
      alert('something went wrong, please try again later')
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
      <>
        <TextInput
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
      </>
    )
  }

  const renderSignupWithEmail = () => {
    return (
      <>
        {config.signupFields.map(renderInputField)}

        <View style={{ marginTop: 22 }}>
          <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible)
            }}>
            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
              <Image
                style={styles.backArrowStyle}
                source={theme.icons.backArrow}
              />
            </TouchableOpacity>

            <Text
              placeholderTextColor="#aaaaaa"
              style={{
                fontSize: 20,
                fontWeight: '900',
                textAlign: 'center',
                marginTop: 40,
              }}>
              Required Other Information
            </Text>

            <Text
              placeholderTextColor="#aaaaaa"
              style={{
                fontWeight: 'bold',
                textAlign: 'center',
                marginTop: 30,
              }}>
              Please upload Driving license image for verification.
            </Text>
            <SignupOnBoard
              setImage={setDriverDocuments}
              image={{
                frontImage: driverDocuments.frontImage,
                backImage: driverDocuments.backImage,
              }}
            />
            <Text
              placeholderTextColor="#aaaaaa"
              style={{
                fontWeight: 'bold',
                textAlign: 'center',
                marginTop: 30,
              }}>
              Please upload RC image for verification.
            </Text>

            <SignupOnboardImg
              setSingleImg={rcImg =>
                setDriverDocuments(prev => ({
                  ...prev,
                  rcImg,
                }))
              }
              singleImg={{
                img: driverDocuments.rcImg,
              }}
            />
            <Text />
            {loading && <TNActivityIndicator />}
            <Text
              placeholderTextColor="#aaaaaa"
              style={{ fontWeight: 'bold', textAlign: 'center' }}>
              Please upload VehicleInsuranceImg insurance image for
              verification.
            </Text>
            <SignupOnboardImg
              setSingleImg={vehicleInsuranceImg =>
                setDriverDocuments(prev => ({
                  ...prev,
                  vehicleInsuranceImg,
                }))
              }
              singleImg={{
                img: driverDocuments.vehicleInsuranceImg,
              }}
            />
            <Text />

            <Button
              containerStyle={styles.SubmitDoc}
              style={styles.SubmitDocText}
              onPress={() => uploadDocs()}>
              {localized('Upload')}
            </Button>
          </Modal>

          <TouchableOpacity
            style={[
              styles.UploadDoc,
              throwDocsErr ? { borderWidth: 1, borderColor: 'red' } : '',
            ]}
            onPress={() => {
              const areFieldsTrue = checkFields()
              if (areFieldsTrue) {
                setModalVisible(true)
              }
            }}>
            <Text style={{ marginTop: 10, marginRight: 25 }}>
              Upload Documents
            </Text>
            <Image style={styles.UploadIcon} source={Img} />
          </TouchableOpacity>
        </View>
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
          {renderSignupWithEmail()}
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
