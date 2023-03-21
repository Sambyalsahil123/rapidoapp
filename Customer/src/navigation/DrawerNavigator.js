import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createStackNavigator } from '@react-navigation/stack'
import IMDrawerMenu from '../Core/ui/drawer/IMDrawerMenu/IMDrawerMenu'
import {
  HomeNavigator,
  TripsNavigator,
  WalletNavigator,
  ProfileNavigator,
} from './InnerStackNavigators'
import { useConfig } from '../config'

const DrawerStack = createStackNavigator()

const DrawerStackNavigator = () => {
  return (
    <DrawerStack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
      }}
      initialRouteName="Home">
      <DrawerStack.Screen
        name={'Home'}
        options={{
          headerShown: false,
        }}
        component={HomeNavigator}
      />
      <DrawerStack.Screen
        name={'Trips'}
        options={{
          headerShown: false,
        }}
        component={TripsNavigator}
      />
      <DrawerStack.Screen
        name={'Wallet'}
        options={{
          headerShown: false,
        }}
        component={WalletNavigator}
      />
      <DrawerStack.Screen
        name={'Profile'}
        options={{
          headerShown: false,
        }}
        component={ProfileNavigator}
      />
    </DrawerStack.Navigator>
  )
}

const Drawer = createDrawerNavigator()

const DrawerNavigator = props => {
  const config = useConfig()
  return (
    <Drawer.Navigator
      drawerPosition="left"
      drawerStyle={{ width: 310 }}
      initialRouteName={'DrawerMain'}
      screenOptions={{ headerShown: false }}
      drawerContent={({ navigation, state }) => {
        return (
          <IMDrawerMenu
            navigation={navigation}
            headerStyle={config.drawerMenu.forceHeaderStyle}
            nameStyle={config.drawerMenu.forceNameStyle}
            emailStyle={config.drawerMenu.forceEmailStyle}
            forceMenuItemsStyle={config.drawerMenu.forceMenuItemsStyle}
            menuItemStyle={config.drawerMenu.forceMenuItemStyle}
            menuItems={config.drawerMenu.upperMenu}
            menuItemsSettings={config.drawerMenu.lowerMenu}
          />
        )
      }}>
      <Drawer.Screen name="DrawerMain" component={DrawerStackNavigator} />
    </Drawer.Navigator>
  )
}

export default DrawerNavigator
