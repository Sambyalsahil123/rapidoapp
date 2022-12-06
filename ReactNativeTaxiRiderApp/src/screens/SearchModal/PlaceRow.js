import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import Entypo from 'react-native-vector-icons/Entypo'
import { useTheme } from 'dopenative'
import dynamicStyles from './styles'

const PlaceRow = ({ data }) => {
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  return (
    <View style={styles.locationItemContainer}>
      <View style={styles.iconContainer}>
        {data.description === 'Home' ? (
          <Entypo name="home" size={28} color={'white'} />
        ) : (
          <Entypo name="location-pin" size={28} color={'white'} />
        )}
      </View>
      <View style={styles.locationTextContainer}>
        <Text style={styles.mainLocationText}>
          {data?.structured_formatting?.main_text ??
            (data.description || data.vicinity)}
        </Text>
        {data?.structured_formatting?.secondary_text && (
          <Text style={styles.secondaryLocationText}>
            {data?.structured_formatting?.secondary_text}
          </Text>
        )}
      </View>
    </View>
  )
}

export default PlaceRow
