import { StyleSheet } from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper'

const driverAvatarSize = 80

const dynamicStyles = (theme, appearance) => {
  return new StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
    activityContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    driverContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '20%',
    },
    driverAvatarContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      height: driverAvatarSize,
      width: driverAvatarSize,
      borderRadius: Math.floor(driverAvatarSize / 2),
      overflow: 'hidden',
    },
    driverAvatar: {
      width: '100%',
      height: '100%',
    },
    ratingsContainer: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      height: '10%',
    },
    ratingStars: {
      color: theme.colors[appearance].primaryBackground,
    },
    doneTitleContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '85%',
      height: 54,
      backgroundColor: theme.colors[appearance].primaryForeground,
      alignSelf: 'center',
      marginBottom: ifIphoneX(34, 16),
    },
    doneTitle: {
      fontSize: 20,
      fontWeight: '400',
      color: theme.colors[appearance].primaryBackground,
    },
    descriptionContainer: {
      width: '100%',
      height: '10%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    descriptionTitle: {
      color: theme.colors[appearance].primaryText,
      fontSize: 19,
      fontWeight: '400',
    },
  })
}

export default dynamicStyles
