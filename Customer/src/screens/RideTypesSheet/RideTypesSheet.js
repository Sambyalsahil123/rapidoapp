import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { View, Text, Pressable } from 'react-native'
import { BottomSheetView } from '@gorhom/bottom-sheet'
import { useTheme } from 'dopenative'
import { useDispatch, useSelector } from 'react-redux'
import { useIsFocused } from '@react-navigation/native'
import RideTypeItem from './RideTypeItem'
import {
  setbottomSheetSnapPoints,
  setDestination,
  setOrigin,
  setSelectedRide,
  setSelectedRidePriceRange,
} from '../../redux'
import dynamicStyles from './styles'
import { bottomContainerHeight } from '../../components/BottomButton/styles'

const RideTypesSheet = props => {
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const { navigation, sheetIndex } = props

  const dispatch = useDispatch()
  const carCategories = useSelector(({ ride }) => ride.carCategories)
  const dropoffETA = useSelector(({ trip }) => trip.dropoffETA)
  const dropoffDistance = useSelector(({ trip }) => trip.dropoffDistance)

  const isFocus = useIsFocused()

  const [selectedType, setSelectedType] = useState(null)

  const layoutHeight = useRef(0)

  useEffect(() => {
    if (carCategories?.length > 0) {
      dispatch(setSelectedRide(carCategories[0]))
      setSelectedType(carCategories[0].type)
    }
  }, [])

  useEffect(() => {
    if (isFocus && layoutHeight.current) {
      dispatch(
        setbottomSheetSnapPoints({
          key: 'ride_types',
          snapPoints: [layoutHeight.current, layoutHeight.current],
          index: 0,
        }),
      )
    }
  }, [isFocus])

  const onSelectRideType = (rideItem, priceRange) => {
    setSelectedType(rideItem.type)
    dispatch(setSelectedRide(rideItem))
    dispatch(setSelectedRidePriceRange(priceRange))
    if (selectedType === rideItem.type) {
      navigation.navigate('RideTypeDetailSheet', {
        ride: rideItem,
      })
    }
  }

  const contentContainerStyle = useMemo(
    () => ({
      ...styles.contentContainerStyle,
      paddingBottom: bottomContainerHeight,
    }),
    [],
  )

  const handleOnLayout = useCallback(
    ({
      nativeEvent: {
        layout: { height },
      },
    }) => {
      dispatch(
        setbottomSheetSnapPoints({
          key: 'ride_types',
          snapPoints: [height, height],
          index: 0,
        }),
      )
      layoutHeight.current = height
    },
    [],
  )

  return (
    <BottomSheetView
      style={contentContainerStyle}
      onLayout={isFocus && handleOnLayout}>
      {carCategories.map(item => (
        <RideTypeItem
          key={item.type}
          dropoffETA={dropoffETA}
          dropoffDistance={dropoffDistance}
          item={item}
          isSelected={item.type === selectedType}
          onPress={onSelectRideType}
        />
      ))}
    </BottomSheetView>
  )
}

export default React.memo(RideTypesSheet)
