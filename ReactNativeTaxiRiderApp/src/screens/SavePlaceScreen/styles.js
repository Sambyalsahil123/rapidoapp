import { StyleSheet } from 'react-native'

const dynamicStyles = (theme, appearance) => {
  return new StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
    inputContainer: {
      width: '100%',
      paddingLeft: 20,
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
    inputTitleContainer: {
      paddingVertical: 5,
    },
    inputTitle: {
      fontSize: 18,
      color: theme.colors[appearance].grey5,
    },
    textInputContainer: {
      paddingVertical: 2,
      borderBottomColor: theme.colors[appearance].grey0,
      borderBottomWidth: 1,
      paddingBottom: 20,
    },
    textInput: {
      fontSize: 18,
      paddingBottom: 0,
      width: '100%',
      fontWeight: '300',
    },
    saveTitleContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '85%',
      height: 54,
      backgroundColor: theme.colors[appearance].grey5,
      alignSelf: 'center',
      marginTop: '45%',
    },
    activeSaveTitleContainer: {
      backgroundColor: theme.colors[appearance].primaryForeground,
    },
    saveTitle: {
      fontSize: 20,
      fontWeight: '400',
      color: theme.colors[appearance].primaryBackground,
    },
  })
}

export default dynamicStyles
