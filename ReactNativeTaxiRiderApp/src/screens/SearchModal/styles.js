import { StyleSheet } from 'react-native'

const dynamicStyles = (theme, appearance) => {
  return new StyleSheet.create({
    container: {
      padding: 10,
      height: '100%',
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
    navHeaderContainer: {
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
    textInput: {
      padding: 10,
      backgroundColor: theme.colors[appearance].grey2,
      marginVertical: 5,
      marginLeft: 20,
      color: theme.colors[appearance].secondaryText,
      borderRadius: 3,
    },
    textInputContainer: {
      width: '100%',
    },
    separator: {
      backgroundColor: theme.colors[appearance].grey2,
      height: 1,
    },
    listView: {
      position: 'absolute',
      top: 105,
      bottom: 0,
    },
    autocompleteContainer: {
      position: 'absolute',
      top: 0,
      left: 10,
      right: 10,
      bottom: 0,
    },
    locationItemContainer: {
      flexDirection: 'row',
      width: '100%',
      alignItems: 'center',
      marginVertical: 5,
      height: 64,
      // borderBottomColor: theme.colors[appearance].grey1,
      // borderBottomWidth: 1,
    },
    locationTextContainer: {
      height: '100%',
      justifyContent: 'center',
    },
    mainLocationText: {
      paddingBottom: 4,
      fontWeight: '400',
      fontSize: 16,
      color: theme.colors[appearance].primaryText,
    },
    secondaryLocationText: {
      fontWeight: '400',
      color: theme.colors[appearance].secondaryForeground,
    },
    iconContainer: {
      backgroundColor: theme.colors[appearance].secondaryText,
      padding: 5,
      borderRadius: 50,
      marginRight: 15,
    },
    circle: {
      width: 5,
      height: 5,
      backgroundColor: 'black',
      position: 'absolute',
      top: 20,
      left: 15,
      borderRadius: 5,
    },
    line: {
      width: 1,
      height: 50,
      backgroundColor: theme.colors[appearance].grey4,
      position: 'absolute',
      top: 28,
      left: 17,
    },
    square: {
      width: 5,
      height: 5,
      backgroundColor: theme.colors[appearance].primaryForeground,
      position: 'absolute',
      top: 80,
      left: 15,
    },
    tintIndicator: {
      backgroundColor: '#2d73ed',
    },
  })
}

export default dynamicStyles
