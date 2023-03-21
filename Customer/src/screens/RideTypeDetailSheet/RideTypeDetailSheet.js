import React, { useMemo, useEffect, useRef, useCallback } from 'react'
import { View, Image, Text } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { BottomSheetView } from '@gorhom/bottom-sheet'
import { useTheme } from 'dopenative'
import { useIsFocused } from '@react-navigation/native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { setbottomSheetSnapPoints } from '../../redux'
import dynamicStyles from './styles'
import { bottomContainerHeight } from '../../components/BottomButton/styles'
import {
  getRideETA,
  getCarImage,
  getRideEstimatedPrice,
  getCarType,
} from '../../utils'
import { useConfig } from '../../config'

const RideTypeDetailSheet = props => {
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const config = useConfig()

  const ride = props.route.params?.ride

  const isFocus = useIsFocused()

  const dispatch = useDispatch()
  const dropoffETA = useSelector(({ trip }) => trip.dropoffETA)
  const dropoffDistance = useSelector(({ trip }) => trip.dropoffDistance)

  const layoutHeight = useRef(0)

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

  const contentContainerStyle = useMemo(
    () => ({
      ...styles.container,
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
          key: 'ride_detail',
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
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={getCarImage(ride.type)} />
      </View>

      <View style={styles.descriptionContainer}>
        <View style={styles.middleContainer}>
          <View style={styles.rightContainer}>
            <Text style={styles.type}>
              {getCarType(ride.type)} <Ionicons name={'person'} size={12} />
              <Text style={styles.numberOfPassenger}>
                {ride.numberOfPassenger}
              </Text>
            </Text>
            <Text style={styles.price}>
              {getRideEstimatedPrice(
                dropoffETA,
                dropoffDistance,
                ride,
                config.displayCurrencyTitle,
              )}
            </Text>
          </View>

          <Text style={styles.time}>{getRideETA(dropoffETA, ride)}</Text>
          <Text style={styles.time}>{ride.description}</Text>
        </View>
      </View>
    </BottomSheetView>
  )
}

export default React.memo(RideTypeDetailSheet)
