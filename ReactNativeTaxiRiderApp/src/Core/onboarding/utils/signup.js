import { Alert } from 'react-native'
import { validatePhoneNumber } from './regex'

export const checkFields = (inputFields, profilePictureFile, localized) => {
  if (!(inputFields?.lastName && inputFields?.firstName)) {
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


  if (!validatePhoneNumber(inputFields?.contactNumber?.trim())) {
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
  // if (!profilePictureFile) {
  //   Alert.alert(
  //     '',
  //     localized('Please upload a Profile Picture'),
  //     [{ text: localized('OK') }],
  //     {
  //       cancelable: false,
  //     },
  //   )
  //   return false
  // }
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

