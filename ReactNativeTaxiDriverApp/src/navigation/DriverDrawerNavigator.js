import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createStackNavigator } from '@react-navigation/stack'
import { useTheme } from 'dopenative'
import IMDrawerMenu from '../Core/ui/drawer/IMDrawerMenu/IMDrawerMenu'
import DriverHomeScreen from '../driverapp/screens/Home/HomeScreen'
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen'
import DriverOrdersScreen from '../driverapp/screens/Orders/OrdersScreen'
import { IMChatScreen } from '../Core/chat'
import {
  IMEditProfileScreen,
  IMUserSettingsScreen,
  IMContactUsScreen,
} from '../Core/profile'
import { useConfig } from '../config'

const DrawerStack = createStackNavigator()

const DrawerStackNavigator = () => {
  const { theme, appearance } = useTheme()
  return (
    <DrawerStack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: theme.colors[appearance].primaryBackground,
        },
        headerTitleStyle: {
          color: theme.colors[appearance].primaryText,
        },
      }}
      initialRouteName="Home">
      <DrawerStack.Screen name={'DriverHome'} component={DriverHomeScreen} />
      <DrawerStack.Screen name={'MyProfile'} component={ProfileScreen} />
      <DrawerStack.Screen name={'OrderList'} component={DriverOrdersScreen} />
      <DrawerStack.Screen name={'ContactUs'} component={IMContactUsScreen} />
      <DrawerStack.Screen name={'Settings'} component={IMUserSettingsScreen} />
      <DrawerStack.Screen
        name={'AccountDetails'}
        component={IMEditProfileScreen}
      />
      <DrawerStack.Screen name={'PersonalChat'} component={IMChatScreen} />
    </DrawerStack.Navigator>
  )
}

const DriverMain = createStackNavigator()
const DriverMainNavigation = () => {
  return (
    <DriverMain.Navigator initialRouteName="Main">
      <DriverMain.Screen
        name="Main"
        options={{ headerShown: false }}
        component={DrawerStackNavigator}
      />
    </DriverMain.Navigator>
  )
}

const DriverDrawer = createDrawerNavigator()
const DriverDrawerNavigator = () => {
  const config = useConfig()
  return (
    <DriverDrawer.Navigator
      initialRouteName="DrawerMain"
      screenOptions={{ headerShown: false }}
      drawerContent={({ navigation }) => (
        <IMDrawerMenu
          navigation={navigation}
          menuItems={config.drawerMenuConfig.driverDrawerConfig.upperMenu}
          menuItemsSettings={
            config.drawerMenuConfig.driverDrawerConfig.lowerMenu
          }
        />
      )}
      drawerPosition="left"
      drawerStyle={{ width: 250 }}>
      <DriverDrawer.Screen name="DrawerMain" component={DriverMainNavigation} />
    </DriverDrawer.Navigator>
  )
}

export default DriverDrawerNavigator
