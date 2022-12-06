import { StyleSheet } from 'react-native'

const cardInputFontSize = 16

const dynamicStyles = (theme, appearance) => {
  return new StyleSheet.create({
    paymentMethodContainer: {
      flexDirection: 'row',
      borderBottomColor: theme.colors[appearance].grey6,
      borderBottomWidth: 0.5,
      paddingLeft: 20,
      height: 60,
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
    methodIconContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    tickIcon: {
      height: 17,
      width: 17,
      tintColor: theme.colors[appearance].primaryText,
    },
    paymentOptionIconContainer: {
      flex: 0.5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    paymentOptionIcon: {
      height: 28,
      width: 28,
      // tintColor: theme.colors[appearance].primaryText
    },
    optionDetailContainer: {
      flex: 4,
      justifyContent: 'center',
      marginVertical: 10,
    },
    optionTitle: {
      color: theme.colors[appearance].primaryText,
      fontSize: cardInputFontSize,
      paddingLeft: 7,
    },
  })
}

export default dynamicStyles
