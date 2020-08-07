import React,{Component} from 'react';
import {createStackNavigator} from 'react-navigation-stack'
import RecieverDetailsScreen from '../screens/RecieverDetailsScreen';
import ItemDonateScreen from '../screens/ItemDonateScreen';

export const AppStackNavigator=createStackNavigator({
    ItemDonateList:{
        screen:ItemDonateScreen,
        navigationOptions:{
            headerShown:false
        }
    },
    RecieverDetails:{
        screen:RecieverDetailsScreen,
        navigationOptions:{
            headerShown:false
        }
    }
},
{
    initialRouteName:'ItemDonateList'
})