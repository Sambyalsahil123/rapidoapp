import React, { useLayoutEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme, useTranslations } from 'dopenative'
import { useNavigation } from '@react-navigation/core'
import { logout, setUserData } from '../../Core/onboarding/redux/auth'
import { IMUserProfileComponent } from '../../Core/profile'
import MenuIcon from '../../components/MenuIcon/MenuIcon'
import { useAuth } from '../../Core/onboarding/hooks/useAuth'
import { useConfig } from '../../config'

const ProfileScreen = () => {
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const authManager = useAuth()

  const currentUser = useSelector(state => state.auth.user)
  const dispatch = useDispatch()

  const navigation = useNavigation()

  const config = useConfig()

  useLayoutEffect(() => {
    const currentTheme = theme.colors[appearance]
    navigation.setOptions({
      title: localized('My Profile'),
      headerStyle: {
        backgroundColor: currentTheme.primaryBackground,
      },
      headerTitleStyle: {
        color: currentTheme.primaryText,
      },
      headerLeft: renderNavHeaderLeft,
    })
  }, [navigation])

  const renderNavHeaderLeft = () => {
    return <MenuIcon onPress={() => navigation.openDrawer()} />
  }

  const onAccountDetailsPress = () => {
    navigation.navigate('AccountDetails', {
      form: config.editProfileFields,
      screenTitle: localized('Edit Profile'),
    })
  }

  const onSettingsPress = () => {
    navigation.navigate('Settings', {
      form: config.userSettingsFields,
      screenTitle: localized('Settings'),
    })
  }

  const onContactUsPress = () => {
    navigation.navigate('ContactUs', {
      screenTitle: localized('Contact Us'),
      form: config.contactUsFields,
      phone: config.contactUsPhoneNumber,
    })
  }

  const onUpdateUser = newUser => {
    dispatch(setUserData({ user: newUser }))
  }

  const onLogout = () => {
    authManager?.logout(currentUser)
    dispatch(logout())
    navigation.reset({
      index: 0,
      routes: [{ name: 'LoadScreen' }],
    })
  }

  const menuItems = [
    {
      title: localized('Account Details'),
      icon: require('../../assets/icons/account-details-icon.png'),
      tintColor: '#6b7be8',
      onPress: onAccountDetailsPress,
    },
    {
      title: localized('Settings'),
      icon: require('../../assets/icons/settings-icon.png'),
      tintColor: '#777777',
      onPress: onSettingsPress,
    },
    {
      title: localized('Contact Us'),
      icon: require('../../assets/icons/contact-us-icon.png'),
      tintColor: '#9ee19f',
      onPress: onContactUsPress,
    },
  ]

  return (
    <IMUserProfileComponent
      user={currentUser}
      onUpdateUser={onUpdateUser}
      onLogout={onLogout}
      menuItems={menuItems}
    />
  )
}

export default ProfileScreen
