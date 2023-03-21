import { StyleSheet } from 'react-native'

const dynamicStyles = (theme, appearance) => {
  return new StyleSheet.create({
    container: {
      width: '100%',
      flex: 1,
      paddingVertical: 10,
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
    navHeaderContainer: {
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
      // backgroundColor: 'pink',
    },
    date: {
      fontSize: 16,
      fontWeight: '300',
      paddingBottom: 5,
    },
    rideType: {
      fontSize: 16,
      fontWeight: '300',
      color: '#595959',
    },
    priceContainer: {
      flex: 1.7,
      paddingVertical: 10,
      // backgroundColor: 'yellow',
      alignItems: 'center',
    },
    price: {
      fontSize: 16,
      fontWeight: '300',
    },
    mapContainer: {
      width: '100%',
      height: 190,
    },
    routeContainer: {
      flexDirection: 'row',
      width: '100%',
      height: 110,
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
    receiptContainer: {
      flex: 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonContainer: {
      width: 100,
      height: 40,
      borderRadius: 30,
      backgroundColor: '#ededed',
      justifyContent: 'center',
      alignItems: 'center',
    },
    receiptTitle: {
      fontSize: 16,
      fontWeight: '300',
    },
  })
}

export default dynamicStyles
