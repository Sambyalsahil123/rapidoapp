import React from 'react'
import { TouchableOpacity, Image } from 'react-native'
import { useTheme } from 'dopenative'
import dynamicStyles from './styles'

export default function MenuIcon({ onPress, source, withShadow }) {
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, withShadow && styles.shadowBackground]}>
      <Image
        style={styles.icon}
        source={source ?? theme.icons.menu}
        resizeMode={'contain'}
      />
    </TouchableOpacity>
  )
}
