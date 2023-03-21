import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import RideTypesSheet from '../screens/RideTypesSheet/RideTypesSheet'
import RideTypeDetailSheet from '../screens/RideTypeDetailSheet/RideTypeDetailSheet'
import ConfirmPickupSheet from '../screens/ConfirmPickupSheet/ConfirmPickupSheet'
import ConfirmRideSheet from '../screens/ConfirmRideSheet/ConfirmRideSheet'
import TripSheet from '../screens/TripSheet/TripSheet'
import HomeSheet from '../screens/HomeSheet/HomeSheet'

const cardStyleInterpolator = ({ current: { progress } }) => ({
  cardStyle: {
    opacity: progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  },
  overlayStyle: {
    opacity: progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.5],
      extrapolate: 'clamp',
    }),
  },
})

const Stack = createStackNavigator()

const BottomSheetNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator,
      }}>
      <Stack.Screen name={'HomeSheet'} component={HomeSheet} />
      <Stack.Screen name={'RideTypesSheet'} component={RideTypesSheet} />
      <Stack.Screen
        name={'RideTypeDetailSheet'}
        // options={{
        //   cardStyleInterpolator,
        // }}
        component={RideTypeDetailSheet}
      />
      <Stack.Screen
        name={'ConfirmPickupSheet'}
        component={ConfirmPickupSheet}
      />
      <Stack.Screen name={'ConfirmRideSheet'} component={ConfirmRideSheet} />
      <Stack.Screen name={'TripSheet'} component={TripSheet} />
    </Stack.Navigator>
  )
}

export default React.memo(BottomSheetNavigator)
