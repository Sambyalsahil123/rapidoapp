import { StyleSheet } from 'react-native'

const dynamicStyles = (theme, appearance) => {
  return new StyleSheet.create({
    headerContainer: {
      backgroundColor: theme.colors[appearance].primaryBackground,
      padding: 15,
      paddingTop: 10,
      borderTopRightRadius: 15,
      borderTopLeftRadius: 15,
    },
    handleContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 2,
    },
    handle: {
      height: 3,
      width: 40,
      backgroundColor: '#999',
      borderRadius: 2,
    },
  })
}

export default dynamicStyles
