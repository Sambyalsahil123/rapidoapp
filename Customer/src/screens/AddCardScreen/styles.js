import { StyleSheet } from 'react-native'

const dynamicStyles = (theme, appearance) => {
  return new StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
    cardField: {
      width: '100%',
      height: 50,
      marginVertical: 30,
    },
    buttonContainer: {
      marginTop: '30%',
      width: '70%',
      alignSelf: 'center',
    },
  })
}

export default dynamicStyles
