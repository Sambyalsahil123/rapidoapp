import { Alert } from 'react-native'
import { validateAadhar, validatePhoneNumber } from './regex'

export const checkFields = (inputFields, profilePictureFile, localized) => {
  if (
    !(
      inputFields?.carName &&
      inputFields?.carNumber &&
      inputFields?.lastName &&
      inputFields?.carType &&
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

export const trimFields = fields => {
  var trimmedFields = {}
  Object.keys(fields).forEach(key => {
    if (fields[key]) {
      trimmedFields[key] = fields[key].trim()
    }
  })
  return trimmedFields
}

export const sendAadharForVerification = async aadharNumber => {
  try {
    setLoading(true)
    ///// SEND FOR AADHAR VERIFICATION

    await axios({
      method: 'post',
      url: 'https://api.cashfree.com/verification/offline-aadhaar/otp',
      headers: {
        'x-client-id': 'CF17381CEUFDHUU4DKIO6CDBN5G',
        'x-client-secret': '5e62ffeedb6e94db5201f2c861255dcd9f184720',
        'Content-Type': 'application/json',
      },
      // data: {
      //   aadhaar_number: aadharNumber,
      // },
      body: JSON.stringify({
        aadhaar_number: aadharNumber,
      }),
    })
      .then(response => {
        console.log(response.data, 'this is in then')
      })
      .catch(error => {
        console.log(error, 'this is in catch')
      })

    console.log('hello')
  } catch (error) {
    console.log(error, 'this is outer catch')
  }
}
