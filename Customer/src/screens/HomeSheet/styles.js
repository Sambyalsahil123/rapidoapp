import { StyleSheet } from 'react-native'

const dynamicStyles = (theme, appearance) => {
  return new StyleSheet.create({
    container: {
      paddingTop: 12,
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
    whereTitleBox: {
      backgroundColor: theme.colors[appearance].grey2,
      margin: 10,
      paddingHorizontal: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    whereTitleText: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.colors[appearance].primaryText,
    },
    searchContainer: {
      width: 100,
      height: '70%',
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderLeftWidth: 1,
      borderLeftColor: theme.colors[appearance].grey1,
    },
    searchTitle: {
      fontSize: 16,
      fontWeight: '400',
      color: theme.colors[appearance].primaryText,
    },
    locationItemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderColor: theme.colors[appearance].grey0,
    },
    iconContainer: {
      backgroundColor: theme.colors[appearance].grey5,
      padding: 10,
      borderRadius: 25,
    },
    destinationText: {
      marginLeft: 10,
      fontWeight: '500',
      fontSize: 16,
      color: theme.colors[appearance].primaryText,
    },
    secondaryLocationText: {
      fontWeight: '400',
      color: theme.colors[appearance].secondaryText,
      paddingTop: 3,
    },
  })
}

export default dynamicStyles
