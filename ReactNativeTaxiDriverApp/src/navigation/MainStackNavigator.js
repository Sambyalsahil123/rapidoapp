import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import { useTranslations } from 'dopenative'
import DriverDrawerNavigator from './DriverDrawerNavigator'
import { IMChatScreen } from '../Core/chat'
import useNotificationOpenedApp from '../Core/helpers/notificationOpenedApp'


const MainStack = createStackNavigator()
const MainStackNavigator = () => {
  useNotificationOpenedApp()
  const { localized } = useTranslations()
  return (
    <MainStack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerBackTitle: localized('Back'),
      }}
      initialRouteName="Main">

        <MainStack.Screen
          name={'Main'}
          options={{
            headerShown: false,
          }}
          component={DriverDrawerNavigator}
        />
      <MainStack.Screen name="PersonalChat" component={IMChatScreen} />
    </MainStack.Navigator>
  )
}

export default MainStackNavigator
