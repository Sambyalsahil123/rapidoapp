import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { LoadScreen, WalkthroughScreen } from '../Core/onboarding'
import MainStackNavigator from './MainStackNavigator'
import LoginStack from './AuthStackNavigator'

const RootStack = createStackNavigator()

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{ headerShown: false, animationEnabled: false }}
        initialRouteName="LoadScreen">
        <RootStack.Screen name="LoadScreen" component={LoadScreen} />
        <RootStack.Screen name="Walkthrough" component={WalkthroughScreen} />
        <RootStack.Screen name="LoginStack" component={LoginStack} />
        <RootStack.Screen name="MainStack" component={MainStackNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

export default RootNavigator
