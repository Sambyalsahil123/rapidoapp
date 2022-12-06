import { StyleSheet } from 'react-native'
import { heightPercentageToDP as h } from 'react-native-responsive-screen'

const styles = (theme, appearance) => {
  return new StyleSheet.create({
    flat: {
      flex: 1,
      color: theme.colors[appearance].primaryBackground,
    },
    container: {
      flex: 1,
    },
    logoutButton: {
      padding: 8,
    },
    logoutButtonImage: {
      width: 24,
      height: 24,
      resizeMode: 'contain',
      tintColor: 'red',
    },
    inactiveViewContainer: {
      flex: 1,
      marginTop: h(25),
    },
    goOnlineButton: {
      width: 200,
      paddingVertical: 16,
      backgroundColor: theme.colors[appearance].primaryForeground,
      alignItems: 'center',
      borderRadius: 8,
    },
    goOnlineButtonText: {
      color: theme.colors[appearance].grey0,
      fontSize: 20,
      fontWeight: 'bold',
    },
    mapStyle: {
      flex: 1,
    },
    mapCarIcon: {
      height: 32,
      width: 32,
      tintColor: theme.colors[appearance].primaryForeground,
    },
  })
}

export default styles
