import React from 'react';
import {Image} from 'react-native';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import ItemDonateScreen from '../screens/ItemDonateScreen';
import ItemRequestScreen from '../screens/ItemRequestScreen';

export const AppTabNavigator = createBottomTabNavigator({
    DonateItems:{
        screen:ItemDonateScreen,
        navigationOptions:{
            tabBarIcon:<Image source={require('../assets/request-list.png')}
            style={{
                width:20,
                height:20
            }}></Image>,
            tabBarLabel:"Donate Items"
        }
    },
    RequestItems:{
        screen:ItemRequestScreen,
        navigationOptions:{
            tabBarIcon:<Image source={require('../assets/request-item.png')}
            style={{
                width:20,
                height:20
            }}></Image>,
            tabBarLabel:"Request Items"
        }
    }
})