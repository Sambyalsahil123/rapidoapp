import { StyleSheet } from 'react-native'

const dynamicStyles = (theme, appearance) => {
  return new StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
    selectedItemContainer: {
      backgroundColor: theme.colors[appearance].grey2,
    },
    image: {
      height: 70,
      width: 80,
      resizeMode: 'contain',
    },
    middleContainer: {
      flex: 1,
      marginHorizontal: 10,
    },
    type: {
      fontWeight: 'bold',
      fontSize: 18,
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
    },
    rightContainer: {
      justifyContent: 'flex-end',
      flexDirection: 'row',
      maxWidth: '50%',
    },
    price: {
      fontWeight: 'bold',
      fontSize: 18,
      marginLeft: 5,
      color: theme.colors[appearance].primaryText,
    },
  })
}

export default dynamicStyles
