import { StyleSheet } from 'react-native'

const dynamicStyles = (theme, appearance) => {
  return new StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
    navHeaderContainer: {
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
    rowsContainer: {
      flexDirection: 'row',
      width: '90%',
      alignSelf: 'center',
    },
    messageContainer: {
      height: 130,
      marginTop: 20,
    },
    messageDescriptionContainer: {
      flex: 4,
    },
    subtitle: {
      fontSize: 18,
      fontWeight: '300',
      paddingBottom: 3,
      color: theme.colors[appearance].primaryText,
    },
    subtitleBold: {
      fontSize: 18,
      fontWeight: '500',
      paddingBottom: 10,
      color: theme.colors[appearance].secondaryForeground,
    },
    mainTitle: {
      fontSize: 26,
      fontWeight: '400',
      paddingBottom: 3,
      color: theme.colors[appearance].primaryText,
    },
    messageImageContainer: {
      flex: 2.5,
    },
    messageImage: {
      width: 150,
      height: 180,
    },
    totalContainer: {
      height: 100,
      borderBottomWidth: 1,
      borderBottomColor: '#72bccc',
      marginTop: 20,
    },
    amountLabelContainer: {
      flex: 4,
      justifyContent: 'center',
    },
    totalTitle: {},
    amountContainer: {
      flex: 2.5,
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    totalPrice: {},
    tripFareTitleContainer: {
      height: 100,
      borderBottomWidth: 1,
      borderBottomColor: '#d9d9d9',
      marginTop: 20,
    },
  })
}

export default dynamicStyles
