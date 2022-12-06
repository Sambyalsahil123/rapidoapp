import { StyleSheet } from 'react-native'

const dynamicStyles = (theme, appearance) => {
  return new StyleSheet.create({
    container: {
      // flex: 1,
      backgroundColor: theme.colors[appearance].primaryBackground,
      paddingTop: 12,
    },
    inputBox: {
      margin: 10,
      padding: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    pickupTitleContainer: {
      width: '70%',
    },
    pickupTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.colors[appearance].primaryText,
    },
    searchContainer: {
      backgroundColor: theme.colors[appearance].grey0,
      height: 38,
      width: 100,
      borderRadius: 75,
      justifyContent: 'center',
      alignItems: 'center',
    },
    searchTitle: {
      color: theme.colors[appearance].primaryText,
    },
  })
}

export default dynamicStyles
