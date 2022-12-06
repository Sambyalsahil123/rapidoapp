import { StyleSheet } from 'react-native'

const dynamicStyles = (theme, appearance) => {
  return new StyleSheet.create({
    container: {
      // flex: 1,
      backgroundColor: theme.colors[appearance].primaryBackground,
      height: 235,
    },
    titleContainer: {
      paddingTop: 10,
      paddingBottom: 20,
      borderBottomColor: '#2d73ed',
      borderBottomWidth: 1,
    },
    title: {
      paddingHorizontal: 10,
      fontSize: 20,
      fontWeight: '600',
      color: theme.colors[appearance].primaryText,
    },
    imageContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 135,
    },
    image: {
      height: 100,
      width: 100,
    },
  })
}

export default dynamicStyles
