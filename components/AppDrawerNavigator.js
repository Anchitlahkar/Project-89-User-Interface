import * as React from 'react';
import CustomSideBarMenu from "./CustomSideBarMenu";
import { TabNavigator } from "./tabNavigator";
import { createDrawerNavigator } from "react-navigation-drawer";
import SettingScreen from '../screens/SettingScreen'
import MyBarter from '../screens/MyBarter'
import NotificationScreen from '../screens/Notification'
import { Icon } from "react-native-elements";


export const AppDrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: TabNavigator,
      navigationOptions: {
        drawerIcon: <Icon name='home' type='fontawesome5' />,
      }
    },
    Settings: {
      screen: SettingScreen,
      navigationOptions: {
        drawerIcon: <Icon name='settings' type='fontawesome5' />,
        drawerLabel: 'Setting'
      }
    },
    MyBarter: {
      screen: MyBarter,
      navigationOptions: {
        drawerIcon: <Icon name='gift' type='font-awesome' />,
        drawerLabel: 'MyBarter'
      }
    },
    Notification:{
      screen: NotificationScreen,
      navigationOptions: {
        drawerIcon: <Icon name='bell' type='font-awesome' />,
        drawerLabel: 'Notification'
      }
    },
  },
  {
    contentComponent: CustomSideBarMenu,
  },
  {
    initialRouteName: "Home",
  }
);
