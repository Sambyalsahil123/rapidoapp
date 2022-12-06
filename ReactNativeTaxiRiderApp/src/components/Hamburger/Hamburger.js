import React from 'react'
import { TouchableOpacity, Image } from 'react-native'
import { useTheme } from 'dopenative'
import dynamicStyles from './styles'

export default function Hamburger({ onPress }) {
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  return (
    <TouchableOpacity style={styles.headerButtonContainer} onPress={onPress}>
      <Image
        style={styles.headerButtonImage}
        source={theme.icons.menuHamburger}
      />
    </TouchableOpacity>
  )
}
