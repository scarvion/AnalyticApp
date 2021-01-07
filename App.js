import React, { Component } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { createAppContainer, createSwitchNavigator} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './homeScreen.js';
import Storage from './Storage.js';
import AddexpSummary from './AddExpSummary.js';
import mainMenu from './MainMenu.js';
import Threshold from './Threshold.js';
import BudgetAnalysis from './BudgetAnalysis.js';
import ExpenseSummary from './ExpenseSummary.js';
import UserLogin from './UserLogin.js';
import CreateAccount from './CreateAccount.js';

const styles = {
  header: {
      backgroundColor: '#2990cc',
      color: 'white',
    }
};
console.disableYellowBox = true;
// switch navigation
const SwitchNavigation = createStackNavigator(
  {
    CreateAccount: {screen: CreateAccount},
    UserLogin: { screen: UserLogin},
      Home: { screen: HomeScreen},
      Storage: { screen: Storage,
        navigationOptions: {
          title: '',
          headerStyle:{
            backgroundColor: '#0083d6',
          },
          headerTintColor: '#fff'
          
        }
      }, 
      AddexpSummary: {screen: AddexpSummary, 
        navigationOptions: {
          title: '',
          headerStyle:{
            backgroundColor: '#0083d6',
          },
          headerTintColor: '#fff'
        },
        
      },
      MainMenu: {screen: mainMenu,
      navigationOptions: {
        headerLeft: () => null,
        headerStyle:{
          backgroundColor: '#0083d6',
        },
        headerTintColor: '#fff'
      } 
    },
    Track: {screen: Threshold,
      navigationOptions: {
        headerStyle:{
          backgroundColor: '#0083d6',
        },
          headerTintColor: '#fff'
      } 
    },
    BudgetAnalysis: {screen: BudgetAnalysis},
    ExpenseSummary: {screen: ExpenseSummary,
      navigationOptions: {
      headerStyle:{
        backgroundColor: '#0083d6',
      },
      headerTintColor: '#fff'},
    }
  },
  {
      // starting route
      initialRouteName: 'UserLogin',
  }
);

export default createAppContainer(SwitchNavigation);

