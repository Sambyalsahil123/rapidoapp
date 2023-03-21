import { StyleSheet } from 'react-native'
import { getStatusBarHeight, ifIphoneX } from 'react-native-iphone-x-helper'

const navIconSize = 50

const dynamicStyles = (theme, appearance) => {
  return new StyleSheet.create({
    container: {
      position: 'absolute',
      left: 10,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
      borderRadius: 25,
      height: navIconSize,
      width: navIconSize,
    },
    shadowBackground: {
      ...ifIphoneX(
        {},
        {
          top: getStatusBarHeight() - 5,
        },
      ),
      left: 20,
      backgroundColor: theme.colors[appearance].primaryBackground,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.34,
      shadowRadius: 6.27,
      elevation: 10,
    },
    icon: {
      height: Math.floor(navIconSize * 0.4),
      width: Math.floor(navIconSize * 0.4),
      tintColor: theme.colors[appearance].secondaryForeground,
    },
  })
}

export default dynamicStyles
