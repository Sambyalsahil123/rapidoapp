import { StyleSheet } from 'react-native'

const cardInputFontSize = 16

const dynamicStyles = (theme, appearance) => {
  return new StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
    navHeaderContainer: {
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
    optionsTitleContainer: {
      width: '100%',
      paddingLeft: 20,
      height: 60,
      paddingVertical: 10,
    },
    optionsTitle: {
      color: theme.colors[appearance].primaryText,
      fontSize: cardInputFontSize,
      paddingLeft: 7,
      fontWeight: 'bold',
    },
    optionsContainer: {
      width: '100%',
      borderBottomColor: theme.colors[appearance].grey6,
      borderBottomWidth: 0.5,
      borderTopColor: theme.colors[appearance].grey6,
      borderTopWidth: 0.5,
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
    paymentMethodContainer: {
      flexDirection: 'row',
      borderBottomColor: theme.colors[appearance].grey6,
      borderBottomWidth: 0.5,
      paddingLeft: 20,
      height: 60,
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
    addNewCardContainer: {
      flexDirection: 'row',
      borderBottomColor: theme.colors[appearance].hairline,
      borderBottomWidth: 0.5,
    },
    addNewCardTitleContainer: {
      flex: 4,
      justifyContent: 'center',
      marginVertical: 10,
    },
    addNewCardTitle: {
      color: theme.colors[appearance].primaryText,
      fontSize: cardInputFontSize,
      paddingLeft: 7,
    },
  })
}

export default dynamicStyles
