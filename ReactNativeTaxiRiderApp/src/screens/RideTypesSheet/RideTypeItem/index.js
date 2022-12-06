import React, { useEffect, useState } from 'react'
import { View, Image, Text, Pressable } from 'react-native'
import dynamicStyles from './styles.js'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useTheme } from 'dopenative'
import {
  getRideETA,
  getCarImage,
  getRideEstimatedPrice,
  getCarType,
} from '../../../utils'
import { useConfig } from '../../../config/index.js'

const RideTypeItem = props => {
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const config = useConfig()

  const { dropoffETA, dropoffDistance, item, onPress, isSelected } = props

  const [priceRange, setPriceRange] = useState('')

  useEffect(() => {
    const currency = config.displayCurrencyTitle
    const range = getRideEstimatedPrice(
      dropoffETA,
      dropoffDistance,
      item,
      currency,
    )
    if (range) {
      setPriceRange(range)
    }
  }, [dropoffETA])

  return (
    <Pressable
      onPress={() => onPress(item, priceRange)}
      style={[styles.container, isSelected && styles.selectedItemContainer]}>
      <Image style={styles.image} source={getCarImage(item.type)} />

      <View style={styles.middleContainer}>
        <Text style={styles.type}>
          {getCarType(item.type)} <Ionicons name={'person'} size={12} />
          <Text style={styles.numberOfPassenger}>{item.numberOfPassenger}</Text>
        </Text>
        <Text style={styles.time}>{getRideETA(dropoffETA, item)}</Text>
      </View>
      <View style={styles.rightContainer}>
        <Text style={styles.price}>{priceRange}</Text>
      </View>
    </Pressable>
  )
}

export default RideTypeItem
