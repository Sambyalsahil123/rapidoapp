import { StyleSheet } from 'react-native'

export const altBottomContainerHeight = 75
export const bottomContainerHeight = 135

const dynamicStyles = (theme, appearance) => {
  return StyleSheet.create({
    container: {
      width: '100%',
      alignItems: 'center',
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
    buttonContainer: {
      height: 55,
      width: '80%',
      backgroundColor: 'black',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
    },
    title: {
      color: 'white',
      fontWeight: '500',
      fontSize: 20,
    },
  })
}

export default dynamicStyles
