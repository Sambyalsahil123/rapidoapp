import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme, useTranslations } from 'dopenative'
import { setUserData } from '../../Core/onboarding/redux/auth'
import dynamicStyles from './styles'
import { updateUser } from '../../Core/users'

export default function SavePlaceScreen(props) {
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const { navigation, route } = props
  const place = route?.params?.place

  const dispatch = useDispatch()
  const currentUser = useSelector(({ auth }) => auth.user)
  const newSavedPlaces = currentUser?.savedPlaces ?? []

  const [name, setName] = useState('')

  const onSavePress = () => {
    const newPlace = {
      ...place,
      name,
    }
    newSavedPlaces[0] = newPlace
    updateUser(currentUser.id, {
      savedPlaces: newSavedPlaces,
    })
    dispatch(
      setUserData({
        user: { ...currentUser, savedPlaces: newSavedPlaces },
      }),
    )
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Main',
        },
      ],
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={styles.inputTitleContainer}>
          <Text style={styles.inputTitle}>{localized('Name')}</Text>
        </View>
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder={"e.g. Ryan's Home"}
            value={name}
            onChangeText={setName}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.inputTitleContainer}>
          <Text style={styles.inputTitle}>{localized('Address')}</Text>
        </View>
        <View style={styles.textInputContainer}>
          <Text numberOfLines={1} style={styles.textInput}>
            {place?.title}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        disabled={!name}
        onPress={onSavePress}
        style={[
          styles.saveTitleContainer,
          name && styles.activeSaveTitleContainer,
        ]}>
        <Text style={styles.saveTitle}>{localized('Save Place')}</Text>
      </TouchableOpacity>
    </View>
  )
}
