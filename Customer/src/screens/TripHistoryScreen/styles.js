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
    emptyViewContainer: {
      marginTop: '25%',
      flex: 1,
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
  })
}

export default dynamicStyles
