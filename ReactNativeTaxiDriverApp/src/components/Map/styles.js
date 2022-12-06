import { StyleSheet, Platform } from 'react-native'

const styles = (theme, appearance) => {
  return new StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    locationContainer: {
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.1,
      elevation: 1,
      borderColor: '#ddd',
      borderRadius: 3,
      flexDirection: 'row',
      ...Platform.select({
        ios: {
          marginTop: 20,
        },
        android: {
          marginTop: 20,
          marginLeft: 20,
        },
      }),
    },
    locationText: {
      marginHorizontal: 10,
      marginVertical: 8,
      fontSize: 14,
      color: '#333',
    },
    locationTimeContainer: {
      backgroundColor: theme.colors[appearance].primaryForeground,
      paddingVertical: 3,
      paddingHorizontal: 8,
    },
    locationTimeText: {
      color: '#fff',
      fontSize: 12,
      textAlign: 'center',
    },
    locationTimeTextSmall: {
      color: '#fff',
      fontSize: 10,
      textAlign: 'center',
    },
    carIcon: {
      width: 52,
      height: 52,
      resizeMode: 'contain',
    },
  })
}

export default styles
