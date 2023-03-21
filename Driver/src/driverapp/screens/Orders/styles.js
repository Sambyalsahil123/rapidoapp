import { StyleSheet } from 'react-native'

const styles = (theme, appearance) => {
  return new StyleSheet.create({
    emptyViewContainer: {
      marginTop: '25%',
      flex: 1,
    },
    flat: {
      flex: 1,
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
    container: {
      marginBottom: 30,
      flex: 1,
      padding: 10,
    },
    photo: {
      width: '100%',
      height: 100,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    address: {
      position: 'absolute',
      top: 16,
      left: 16,
      right: 16,
      color: '#eeeeee',
      opacity: 0.8,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    buttonsContainer: {
      flexDirection: 'row',
      flex: 2,
    },
    actionContainer: {
      flexDirection: 'row',
      marginTop: 30,
    },
    total: {
      flex: 1,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontWeight: 'bold',
      padding: 5,
      textAlign: 'center',
      color: theme.colors[appearance].primaryText,
      borderColor: theme.colors[appearance].grey3,
    },
    statusText: {
      marginRight: 8,
      color: theme.colors[appearance].primaryForeground,
      fontSize: 14,
      borderWidth: 1,
      borderColor: theme.colors[appearance].primaryForeground,
      borderRadius: 5,
      textAlign: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      padding: 10,
    },
    routeContainer: {
      flexDirection: 'row',
      width: '100%',
      height: 75,
    },
    routeIindicatorContainer: {
      flex: 0.7,
      justifyContent: 'center',
      alignItems: 'center',
    },
    circle: {
      width: 7,
      height: 7,
      backgroundColor: 'black',
      borderRadius: 5,
    },
    line: {
      width: 2,
      height: '40%',
      backgroundColor: '#c4c4c4',
    },
    square: {
      width: 7,
      height: 7,
      backgroundColor: 'black',
    },
    routeDescriptionContainer: {
      flex: 4,
      justifyContent: 'space-between',
      paddingTop: 10,
    },
    routeTitle: {
      lineHeight: 18,
      fontSize: 16,
      fontWeight: '300',
      color: '#595959',
      paddingRight: 60,
    },
  })
}

export default styles
