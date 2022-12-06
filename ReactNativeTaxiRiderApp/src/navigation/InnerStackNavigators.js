import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { useTheme, useTranslations } from 'dopenative'
import HomeScreen from '../screens/HomeScreen'
import TripHistoryScreen from '../screens/TripHistoryScreen/TripHistoryScreen'
import TripsHistoryDetailScreen from '../screens/TripsHistoryDetailScreen/TripsHistoryDetailScreen'
import TripReceiptScreen from '../screens/TripReceiptScreen/TripReceiptScreen'
import WalletScreen from '../screens/WalletScreen/WalletScreen'
import SearchModal from '../screens/SearchModal/SearchModal'
import {
  IMEditProfileScreen,
  IMUserSettingsScreen,
  IMContactUsScreen,
} from '../Core/profile'
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen'

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

const HomeStack = createStackNavigator()

const HomeNavigator = props => {
  const { theme, appearance } = useTheme()
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name={'Home'}
        options={{
          headerTitle: false,
          headerTransparent: true,
        }}
        component={HomeScreen}
      />
      <HomeStack.Screen
        name={'Search'}
        options={{
          // headerShown: false,
          headerTitle: false,
          headerBackTitleVisible: false,
          cardStyleInterpolator,
          gestureDirection: 'vertical',
          headerTintColor: theme.colors[appearance].primaryText,
        }}
        component={SearchModal}
      />
    </HomeStack.Navigator>
  )
}

const TripsStack = createStackNavigator()

const TripsNavigator = props => {
  const { localized } = useTranslations()

  return (
    <TripsStack.Navigator>
      <TripsStack.Screen
        name={'Trips'}
        options={{
          headerTitle: localized('Your Trips'),
        }}
        component={TripHistoryScreen}
      />
      <TripsStack.Screen
        name={'TripsDetail'}
        options={{
          headerTitle: false,
          // headerTransparent: true,
        }}
        component={TripsHistoryDetailScreen}
      />
      <TripsStack.Screen
        name={'TripReceipt'}
        options={{
          headerTitle: false,
          // headerTransparent: true,
        }}
        component={TripReceiptScreen}
      />
    </TripsStack.Navigator>
  )
}

const WalletStack = createStackNavigator()

const WalletNavigator = props => {
  const { localized } = useTranslations()

  return (
    <WalletStack.Navigator>
      <WalletStack.Screen
        name={'Wallet'}
        options={{
          headerTitle: localized('Wallet'),
        }}
        component={WalletScreen}
      />
    </WalletStack.Navigator>
  )
}

const ProfileStack = createStackNavigator()

const ProfileNavigator = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="MyProfile" component={ProfileScreen} />
      <ProfileStack.Screen
        name="AccountDetails"
        component={IMEditProfileScreen}
      />
      <ProfileStack.Screen name="Settings" component={IMUserSettingsScreen} />
      <ProfileStack.Screen name="ContactUs" component={IMContactUsScreen} />
    </ProfileStack.Navigator>
  )
}

// const ProfileNavigator = (props) => {
//   return (
//     <WalletStack.Navigator>
//       <WalletStack.Screen
//         name={'Wallet'}
//         options={{
//           headerTitle: false,
//           // headerTransparent: true,
//         }}
//         component={WalletScreen}
//       />
//     </WalletStack.Navigator>
//   );
// };

export { HomeNavigator, TripsNavigator, WalletNavigator, ProfileNavigator }
