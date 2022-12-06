import React, { useMemo, useCallback, useRef, useEffect } from 'react'
import { Alert, View, Text, Pressable } from 'react-native'
import { BottomSheetView } from '@gorhom/bottom-sheet'
import { useDispatch, useSelector } from 'react-redux'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useTheme, useTranslations } from 'dopenative'
import Entypo from 'react-native-vector-icons/Entypo'
import { useIsFocused } from '@react-navigation/native'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { setbottomSheetSnapPoints, setDestination } from '../../redux'
import dynamicStyles from './styles'
import { setUserData } from '../../Core/onboarding/redux/auth'
import { updateUser } from '../../Core/users'

const whereTitleBoxHeight = 74

const HomeSheet = props => {
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const { navigation } = props
  const { bottom: safeBottomArea } = useSafeAreaInsets()

  const dispatch = useDispatch()

  const isFocus = useIsFocused()

  const layoutHeight = useRef(0)
  const hasNavigated = useRef(false)

  const currentUser = useSelector(({ auth }) => auth.user)
  const origin = useSelector(({ trip }) => trip.origin)
  const destination = useSelector(({ trip }) => trip.destination)

  const addPlace = { name: localized('Enter New Address'), placeId: '' }
  const savedPlaces = currentUser?.savedPlaces ?? [addPlace]
  const hasRoute = origin && destination
  const minLayoutHeight =
    whereTitleBoxHeight + safeBottomArea + ifIphoneX(5, 25)
  const contentHeght = savedPlaces?.length > 1 ? 256 : 156

  useEffect(() => {
    if (hasRoute && isFocus && !hasNavigated.current) {
      navigation.navigate('RideTypesSheet')
      hasNavigated.current = true
    }
  }, [hasRoute, isFocus])

  useEffect(() => {
    if (isFocus && layoutHeight.current) {
      dispatch(
        setbottomSheetSnapPoints({
          key: 'home_search',
          snapPoints: [minLayoutHeight, layoutHeight.current],
          index: 1,
        }),
      )
    }

    if (
      isFocus &&
      destination &&
      !navigation.canGoBack() &&
      hasNavigated.current
    ) {
      dispatch(setDestination(null))
      hasNavigated.current = false
    }
  }, [isFocus])

  const contentContainerStyle = useMemo(
    () => ({
      ...styles.container,
      height: contentHeght + safeBottomArea + 20 + ifIphoneX(0, 5),
    }),
    [safeBottomArea],
  )

  const onSearchLocation = () => {
    navigation.navigate('Search')
  }

  const onPlacePress = item => {
    if (item.placeId) {
      dispatch(setDestination(item))
      navigation.navigate('RideTypesSheet')
      hasNavigated.current = true
      return
    }
    navigation.navigate('Search', {
      savingPlace: true,
    })
  }

  const onPlaceLongPress = (item, index) => {
    if (!item.placeId) {
      return
    }
    Alert.alert(
      localized('Confirm Delete'),
      localized(`Remove ${item.name ?? item.title} from saved place`),
      [
        {
          onPress: () => onConfirmRemove(index),
          text: localized('Remove'),
          style: 'destructive',
        },
        { text: localized('Cancel') },
      ],
      { cancelable: false },
    )
  }

  const onConfirmRemove = index => {
    const newSavedPlaces = [...savedPlaces]
    if (index === 0) {
      newSavedPlaces[0] = addPlace
    }

    if (index === 1) {
      newSavedPlaces.splice(index, 1)
    }
    updateUser(currentUser.id, {
      savedPlaces: newSavedPlaces,
    })
    dispatch(
      setUserData({
        user: { ...currentUser, savedPlaces: newSavedPlaces },
      }),
    )
  }

  const handleOnLayout = useCallback(
    ({
      nativeEvent: {
        layout: { height },
      },
    }) => {
      dispatch(
        setbottomSheetSnapPoints({
          key: 'home_search',
          snapPoints: [minLayoutHeight, height],
          index: 1,
        }),
      )
      layoutHeight.current = height
    },
    [],
  )

  const getIcon = name => {
    const includeHome = name?.toLowerCase().includes('home')
    const includeWork = name?.toLowerCase().includes('work')

    if (includeWork) {
      return <AntDesign name={'clockcircle'} size={20} color={'#ffffff'} />
    }
    if (includeHome) {
      return <Entypo name={'home'} size={20} color={'#ffffff'} />
    }
    return <Entypo name="location-pin" size={20} color={'#ffffff'} />
  }

  const renderSavedPlace = (item, index) => {
    const place = item?.title ? item : addPlace

    return (
      <Pressable
        key={`${index}`}
        onPress={() => onPlacePress(place)}
        onLongPress={() => onPlaceLongPress(place, index)}
        style={styles.locationItemContainer}>
        <View style={styles.iconContainer}>{getIcon(place.name)}</View>
        <View>
          <Text style={styles.destinationText}>
            {place.name ?? place.title}
          </Text>
          {place.subtitle && (
            <Text
              style={[styles.destinationText, styles.secondaryLocationText]}>
              {place.subtitle}
            </Text>
          )}
        </View>
      </Pressable>
    )
  }

  return (
    <BottomSheetView
      style={contentContainerStyle}
      onLayout={isFocus && handleOnLayout}>
      <Pressable
        onPress={onSearchLocation}
        style={[styles.whereTitleBox, { height: whereTitleBoxHeight }]}>
        <Text style={styles.whereTitleText}>{localized('Where to?')}</Text>

        <View style={styles.searchContainer}>
          <Text style={styles.searchTitle}>{localized('Search')}</Text>
        </View>
      </Pressable>

      {savedPlaces.map(renderSavedPlace)}
    </BottomSheetView>
  )
}

export default React.memo(HomeSheet)
