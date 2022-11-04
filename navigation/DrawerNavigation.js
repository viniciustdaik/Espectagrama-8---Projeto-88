import React from 'react';

import { createDrawerNavigator } from '@react-navigation/drawer';

import TabNavigator from './TabNavigator';
import StackNavigator from "./StackNavigator";
import Profile from '../screens/Profile';
import Logout from '../screens/Logout';

import CustomSidebarMenu from "../screens/CustomSidebarMenu";

const Drawer = createDrawerNavigator();
const DrawerNavigator = () => {
    return (
        <Drawer.Navigator
            drawerContentOptions={{
                activeTintColor: "#e91e63",
                inactiveTintColor: "#1e4ae9",//this.state.light_theme ? "black" : "#1e4ae9",
                itemStyle: { marginVertical: 5 }
            }}
            drawerContent={props => <CustomSidebarMenu {...props} />}>
            <Drawer.Screen name="Tela Inicial" component={StackNavigator} options={{
                unmountOnBlur: true
            }} />
            <Drawer.Screen name="Perfil" component={Profile} options={{
                unmountOnBlur: true
            }} />
            <Drawer.Screen name="Sair" component={Logout} options={{
                unmountOnBlur: true
            }} />
        </Drawer.Navigator>
    );
}

export default DrawerNavigator;