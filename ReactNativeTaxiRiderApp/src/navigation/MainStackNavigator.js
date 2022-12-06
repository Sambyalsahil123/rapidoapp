import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import { useTranslations } from 'dopenative'
import { IMChatScreen } from '../Core/chat'
import DrawerNavigator from './DrawerNavigator'
import WalletScreen from '../screens/WalletScreen/WalletScreen'
import SavePlaceScreen from '../screens/SavePlaceScreen/SavePlaceScreen'
import RatingsScreen from '../screens/RatingsScreen/RatingsScreen'
import AddCardScreen from '../screens/AddCardScreen/AddCardScreen'
import useNotificationOpenedApp from '../Core/helpers/notificationOpenedApp'

const cardStyleInterpolator = ({ current, layouts }) => {
  return {
    cardStyle: {
      transform: [
        {
          translateY: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.height, 0],
          }),
        },
      ],
    },
  }
}

const MainStack = createStackNavigator()
const MainStackNavigator = () => {
  useNotificationOpenedApp()
  const { localized } = useTranslations()
  const currentUser = useSelector(state => state.auth.user)
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
          component={DrawerNavigator}
        />


      <MainStack.Screen name="PersonalChat" component={IMChatScreen} />
      <MainStack.Screen
        name="Ratings"
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
        component={RatingsScreen}
      />
      <MainStack.Screen
        name={'ChooseWallet'}
        options={{
          cardStyleInterpolator,
          gestureDirection: 'vertical',
          title: 'Change Wallet',
        }}
        component={WalletScreen}
      />
      <MainStack.Screen
        name={'SavePlace'}
        options={{
          title: 'Save place',
        }}
        component={SavePlaceScreen}
      />
      <MainStack.Screen
        name={'AddCard'}
        options={{
          title: 'Add Card',
        }}
        component={AddCardScreen}
      />
    </MainStack.Navigator>
  )
}

export default MainStackNavigator
