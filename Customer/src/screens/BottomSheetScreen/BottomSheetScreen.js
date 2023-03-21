import React, { useEffect, useRef } from 'react'
import { View } from 'react-native'
import BottomSheet from '@gorhom/bottom-sheet'
import { useTheme } from 'dopenative'
import { useSelector } from 'react-redux'
import BottomSheetNavigator from '../../navigation/BottomSheetNavigator'
import dynamicStyles from './styles'

const BottomSheetScreen = props => {
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const bottomSheetSnapPoints = useSelector(
    ({ bottomSheet }) => bottomSheet.bottomSheetSnapPoints,
  )
  const BottomSheetRef = useRef(null)

  useEffect(() => {
    BottomSheetRef.current?.snapToIndex(bottomSheetSnapPoints.index)
  }, [bottomSheetSnapPoints.key])

  const renderHandleComponent = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>
      </View>
    )
  }

  return (
    <BottomSheet
      ref={BottomSheetRef}
      index={bottomSheetSnapPoints.index}
      snapPoints={bottomSheetSnapPoints.snapPoints}
      handleComponent={renderHandleComponent}
      animateOnMount={true}>
      <BottomSheetNavigator />
    </BottomSheet>
  )
}
export default React.memo(BottomSheetScreen)
