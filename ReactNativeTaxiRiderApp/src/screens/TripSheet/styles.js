import { Dimensions, StyleSheet } from 'react-native'

const height = Dimensions.get('window').height

const itemContainerHeight = Math.floor(height * 0.112)
const callIconSize = Math.floor(height * 0.07)
const bottomDescriptionFontSize = Math.floor(height * 0.02)

const dynamicStyles = (theme, appearance) => {
  return new StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
    headerContainer: {
      flexDirection: 'row',
      height: 80,
    },
    descriptionContainer: {
      flex: 7,
      justifyContent: 'center',
    },
    description: {
      fontSize: 22,
      fontWeight: '500',
      color: theme.colors[appearance].secondaryForeground,
      paddingLeft: 20,
    },
    minuteDetailContainer: {
      flex: 3,
      alignItems: 'center',
      justifyContent: 'center',
    },
    minuteCardContainer: {
      width: '50%',
      height: '80%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#2d73ed',
    },
    minuteCount: {
      fontSize: 24,
      textAlign: 'center',
      color: '#fff',
    },
    minuteTitle: {
      fontSize: 18,
      textAlign: 'center',
      color: '#fff',
    },
    rideDetailContainer: {
      flexDirection: 'row',
      height: 150,
    },
    rideAvatarsContainer: {
      flex: 6.5,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    driverAvatarContainer: {
      backgroundColor: theme.colors[appearance].grey6,
      height: 70,
      width: 70,
      borderRadius: 35,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      borderColor: '#fff',
      borderWidth: 3,
    },
    driverAvatar: {
      height: '98%',
      width: '98%',
    },
    carAvatarContainer: {
      backgroundColor: theme.colors[appearance].primaryBackground,
      justifyContent: 'center',
      alignItems: 'center',
      width: 70,
      height: 50,
      marginLeft: -20,
      zIndex: -1,
    },
    carAvatar: {
      height: '98%',
      width: '98%',
    },
    ratingsContainer: {
      position: 'absolute',
      bottom: 0,
      backgroundColor: theme.colors[appearance].primaryBackground,
      paddingVertical: 3,
      width: 72,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,

      elevation: 5,
      borderRadius: 20,
    },
    ratings: {
      fontSize: 16,
      color: theme.colors[appearance].primaryText,
      textAlign: 'center',
    },
    carDescriptionContainer: {
      flex: 4.5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    carNumber: {
      fontSize: 18,
      fontWeight: '600',
    },
    carName: {
      fontSize: 18,
      fontWeight: '300',
    },
    driverContactContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      height: 80,
      paddingHorizontal: 20,
    },
    driverNameContainer: {
      flex: 7,
      justifyContent: 'center',
    },
    driverName: {
      fontSize: 16,
      color: '#2d73ed',
      paddingLeft: 10,
    },
    callIconContainer: {
      flex: 3,
      justifyContent: 'center',
      alignItems: 'flex-end',
    },
    callIconImageContainer: {
      width: callIconSize,
      height: callIconSize,
      borderRadius: Math.floor(callIconSize / 2),
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      backgroundColor: theme.colors[appearance].grey3,
    },
    callIcon: {
      height: '40%',
      width: '40%',
    },
    bottomScrollContainer: {
      height: Math.floor(itemContainerHeight * 3),
    },
    dropoffContainer: {
      flexDirection: 'row',
      height: itemContainerHeight,
      borderBottomColor: '#f3f3f3',
      borderBottomWidth: 1,
    },
    bottomIconContainer: {
      flex: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    bottomIcon: {
      height: 24,
      width: 24,
    },
    bottomIconTint: {
      tintColor: theme.colors[appearance].primaryText,
    },
    bottomDescriptionContainer: {
      flex: 6,
      justifyContent: 'center',
    },
    bottomDescription: {
      fontSize: bottomDescriptionFontSize,
      paddingBottom: 5,
      color: theme.colors[appearance].primaryText,
    },
    bottomActionContainer: {
      flex: 2,
      justifyContent: 'center',
    },
    bottomAction: {
      fontSize: bottomDescriptionFontSize + 1,
      color: 'blue',
    },
    paymentContainer: {
      flexDirection: 'row',
      height: itemContainerHeight,
      borderBottomColor: '#f3f3f3',
      borderBottomWidth: 1,
    },
    shareContainer: {
      flexDirection: 'row',
      height: itemContainerHeight,
      borderBottomColor: '#f3f3f3',
      borderBottomWidth: 1,
    },
    cancelContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: 70,
      borderBottomColor: '#f3f3f3',
      borderBottomWidth: 1,
      borderTopColor: '#f3f3f3',
      borderTopWidth: 1,
    },
    cancelTitle: {
      fontSize: 17,
      color: 'red',
    },
  })
}

export default dynamicStyles
