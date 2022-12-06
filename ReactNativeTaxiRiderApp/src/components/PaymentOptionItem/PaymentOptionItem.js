import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { useTheme } from 'dopenative'
import dynamicStyles from './styles'

export default function PaymentOptionItem({
  index,
  selectedMethodIndex,
  item,
  onPress,
  onLongPress,
  isLastItem,
  selectedIconSource,
}) {
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  return (
    <TouchableOpacity
      onPress={() => onPress(index, item)}
      onLongPress={() => {
        onLongPress && onLongPress(item)
      }}
      style={[
        styles.paymentMethodContainer,
        {
          borderBottomWidth: isLastItem ? 0 : 0.5,
        },
      ]}
      key={index + ''}>
      <View style={styles.paymentOptionIconContainer}>
        <Image
          source={item?.iconSource}
          resizeMode="contain"
          style={styles.paymentOptionIcon}
        />
      </View>
      <View style={styles.optionDetailContainer}>
        <Text style={styles.optionTitle}>{item?.title}</Text>
      </View>
      <View style={styles.methodIconContainer}>
        {selectedMethodIndex === index && (
          <Image
            source={selectedIconSource}
            resizeMode="contain"
            style={styles.tickIcon}
          />
        )}
      </View>
    </TouchableOpacity>
  )
}
