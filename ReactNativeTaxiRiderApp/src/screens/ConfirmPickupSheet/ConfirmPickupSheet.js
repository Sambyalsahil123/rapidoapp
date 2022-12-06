import React, { useMemo, useCallback } from 'react'
import { View, Text, Pressable } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { BottomSheetView } from '@gorhom/bottom-sheet'
import { useIsFocused } from '@react-navigation/native'
import { useTheme, useTranslations } from 'dopenative'
import { setbottomSheetSnapPoints } from '../../redux'
import dynamicStyles from './styles'
import { altBottomContainerHeight } from '../../components/BottomButton/styles'

const ConfirmPickupSheet = props => {
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const dispatch = useDispatch()

  const isFocus = useIsFocused()

  const { navigation } = props

  const origin = useSelector(({ trip }) => trip.origin)

  const onSearch = item => {}

  const contentContainerStyle = useMemo(
    () => ({
      ...styles.container,
      paddingBottom: altBottomContainerHeight,
    }),
    [],
  )

  const onConfirmPickupSheet = () => {
    navigation.navigate('Search', { updatingOrigin: true })
  }

  const handleOnLayout = useCallback(
    ({
      nativeEvent: {
        layout: { height },
      },
    }) => {
      dispatch(
        setbottomSheetSnapPoints({
          key: 'confirm_pickup',
          snapPoints: [height, height],
          index: 0,
        }),
      )
    },
    [],
  )

  return (
    <BottomSheetView
      style={contentContainerStyle}
      onLayout={isFocus && handleOnLayout}>
      <Pressable onPress={onConfirmPickupSheet} style={styles.inputBox}>
        <View style={styles.pickupTitleContainer}>
          <Text numberOfLines={2} style={styles.pickupTitle}>
            {origin?.title ?? localized('Choose location')}
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <Text style={styles.searchTitle}>{localized('search')}</Text>
        </View>
      </Pressable>
    </BottomSheetView>
  )
}

export default React.memo(ConfirmPickupSheet)
