import { StyleSheet } from 'react-native'

const dynamicStyles = (theme, appearance) => {
  return new StyleSheet.create({
    container: {
      paddingTop: 12,
      width: '100%',
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
    imageContainer: {
      width: '100%',
      height: 120,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      height: 150,
      width: 160,
      resizeMode: 'contain',
    },
    descriptionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 20,
      paddingLeft: 20,
    },
    middleContainer: {
      flex: 1,
      marginHorizontal: 10,
    },
    type: {
      fontWeight: 'bold',
      fontSize: 25,
      marginBottom: 5,
      color: theme.colors[appearance].primaryText,
    },
    numberOfPassenger: {
      fontWeight: 'bold',
      fontSize: 12,
      marginBottom: 5,
      color: theme.colors[appearance].primaryText,
    },
    time: {
      color: theme.colors[appearance].primaryText,
      fontSize: 18,
      paddingBottom: 3,
    },
    rightContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingRight: 5,
      paddingVertical: 5,
    },
    price: {
      fontWeight: 'bold',
      fontSize: 21,
      marginLeft: 5,
      color: theme.colors[appearance].primaryText,
    },
  })
}

export default dynamicStyles
