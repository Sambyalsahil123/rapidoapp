import { StyleSheet } from 'react-native'

const dynamicStyles = (theme, appearance) => {
  return new StyleSheet.create({
    contentContainerStyle: {
      paddingTop: 12,
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
  })
}

export default dynamicStyles
