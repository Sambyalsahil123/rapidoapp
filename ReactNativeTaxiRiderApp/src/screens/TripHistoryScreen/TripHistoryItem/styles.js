import { StyleSheet } from 'react-native'

const dynamicStyles = (theme, appearance) => {
  return new StyleSheet.create({
    container: {
      width: '100%',
      paddingVertical: 10,
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
    detialContainer: {
      flexDirection: 'row',
      width: '100%',
      paddingVertical: 10,
    },
    dateContainer: {
      flex: 7,
      justifyContent: 'center',
      paddingVertical: 10,
      paddingLeft: 20,
    },
    date: {
      fontSize: 14,
      fontWeight: '500',
      paddingBottom: 5,
      color: theme.colors[appearance].primaryText,
    },
    rideType: {
      fontSize: 12,
      fontWeight: '300',
      color: theme.colors[appearance].secondaryForeground,
    },
    priceContainer: {
      flex: 1.7,
      paddingVertical: 10,
      alignItems: 'flex-end',
    },
    price: {
      fontSize: 16,
      fontWeight: '300',
      color: theme.colors[appearance].primaryText,
    },
    iconContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      width: 13,
      height: 14,
      tintColor: theme.colors[appearance].grey1,
    },
    mapContainer: {
      width: '100%',
      height: 190,
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
  })
}

export default dynamicStyles
