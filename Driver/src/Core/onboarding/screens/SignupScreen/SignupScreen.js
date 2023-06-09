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
import { useTheme, useTranslations } from 'dopenative'
import TNActivityIndicator from '../../../truly-native/TNActivityIndicator'
import TNProfilePictureSelector from '../../../truly-native/TNProfilePictureSelector/TNProfilePictureSelector'
import TermsOfUseView from '../../components/TermsOfUseView'
import { useOnboardingConfig } from '../../hooks/useOnboardingConfig'
import { SignupOnBoard, SignOnBoardImg, dynamicStyles } from '../SignupScreen'
import Img from './upload.png'
import { OTPVerificationModal } from '../SmsAuthenticationScreen/OTPVerificationModal'
import storage from '@react-native-firebase/storage'
import { checkFields, trimFields } from '../../utils/signup'
import CustomDropdown from './CustomDropdown'

const SignupScreen = props => {
  const [modalVisible, setModalVisible] = useState(false)
  const { navigation } = props
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
  //UPLOAD IMAGES TO FIRESTORE
  const uploadDocs = () => {
    setLoading(true)
    const allData = {
      profilePhoto: profilePictureFile?.uri,
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
          `Users Documents/${generatedFolderName}/${key}`,
        )

        try {
          await reference.putFile(value)
          const url = await storage()
            .ref(`Users Documents/${generatedFolderName}/${key}`)
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

  const onRegister = async () => {
    const areFiedsTrue = checkFields(inputFields, profilePictureFile, localized)

    if (!areFiedsTrue) {
      return
    }
    setLoading(true)

    const userDetails = {
      ////// SEND USER SIGUP DATA IN DB

      profilePictureURL: documentUrls.profilePhoto,
      ...trimFields(inputFields),
      appIdentifier: config.appIdentifier,
      images: documentUrls,
      isActive: false,
      location: {
        heading: 0,
        latitude: 37.310212191697715,
        longitude: -121.95864486694336,
      },
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

    const SendOTP = 'https://us-central1-bega-370917.cloudfunctions.net/sendOTP'

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
      const response = await axios.post(SendOTP, {
        phoneNumber: Number(restructuredPhoneNumber),
        IsApproved: false,
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

  const IsUserExist = async () => {
    setLoading(true)
    const phoneLength = inputFields.phoneNumber.length

    const restructuredPhoneNumber = `${
      phoneLength === 13
        ? inputFields.phoneNumber
        : '000' + inputFields.phoneNumber
    }`.slice(3, 13)

    const checkUserExist =
      ' https://us-central1-bega-370917.cloudfunctions.net/isUserExists'

    try {
      const response = await axios.post(checkUserExist, {
        phoneNumber: Number(restructuredPhoneNumber),
      })
      if (response?.data?.error) {
        alert(response?.data?.error)
        setLoading(false)
      }
      if (response?.data?.success) {
        setModalVisible(true)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      alert(error)
    }
  }

  // const renderInputField = (field, index) => {
  //   return (
  //     <>
  //       <TextInput
  //         maxLength={field.maxLength}
  //         key={index?.toString()}
  //         style={styles.InputContainer}
  //         placeholder={field.placeholder}
  //         placeholderTextColor="#aaaaaa"
  //         secureTextEntry={field.secureTextEntry}
  //         onChangeText={text => onChangeInputFields(text, field.key)}
  //         value={inputFields[field.key]}
  //         keyboardType={field.type}
  //         underlineColorAndroid="transparent"
  //         autoCapitalize={field.autoCapitalize}
  //       />
  //     </>
  //   )
  // }

  const renderInputField = (field, index) => {
    return (
      <>
        {field.type === 'select' ? (
          <CustomDropdown
            placeholder={field.placeholder}
            options={field.options}
            style={styles.InputContainer}
            displayOptions={field.displayOptions}
            onSelectOption={option => onChangeInputFields(option, field.key)}
          />
        ) : (
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
        )}
      </>
    )
  }

  const renderSignWithPhoneNumber = () => {
    return (
      <>
        {config?.signupFields?.map(renderInputField)}

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
                frontImage: driverDocuments?.frontImage,
                backImage: driverDocuments?.backImage,
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

            <SignOnBoardImg
              setSingleImg={rcImg =>
                setDriverDocuments(prev => ({
                  ...prev,
                  rcImg,
                }))
              }
              singleImg={{
                img: driverDocuments?.rcImg,
              }}
            />
            <Text />
            {loading && <TNActivityIndicator />}
            <Text
              placeholderTextColor="#aaaaaa"
              style={{ fontWeight: 'bold', textAlign: 'center' }}>
              Please upload Vehicle insurance image for verification.
            </Text>
            <SignOnBoardImg
              setSingleImg={vehicleInsuranceImg =>
                setDriverDocuments(prev => ({
                  ...prev,
                  vehicleInsuranceImg,
                }))
              }
              singleImg={{
                img: driverDocuments?.vehicleInsuranceImg,
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
              const areFieldsTrue = checkFields(
                inputFields,
                profilePictureFile,
                localized,
              )
              if (areFieldsTrue) {
                // setModalVisible(true)
                IsUserExist()
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
          {renderSignWithPhoneNumber()}
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
