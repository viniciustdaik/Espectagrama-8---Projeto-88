import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feed from "../screens/Feed";
import CreatePost from "../screens/CreatePost";
import { RFValue } from "react-native-responsive-fontsize";

import firebase from "firebase";

const Tab = createMaterialBottomTabNavigator();

export default class BottomTabNavigator extends Component {//const BottomTabNavigator = () => {
    constructor(props) {
        super(props);
        this.state = {
            light_theme: false,
        }

    }

    componentDidMount() {
        this.fetchUser();
    }

    fetchUser = () => {
        let theme;
        firebase
            .database()
            .ref('/users/' + firebase.auth().currentUser.uid)
            .on('value', (snapshot) => {
                theme = snapshot.val().current_theme;
                this.setState({ light_theme: theme === 'light' });
            });
    };

    render() {
        return (
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;
                        if (route.name === 'Feed') {
                            iconName = focused
                                ? 'book'
                                : 'book-outline';
                        } else if (route.name === 'Criar Postagem') {
                            iconName = focused ? 'create' : 'create-outline';
                        }
                        return <Ionicons name={iconName} size={RFValue(20)} color={color} />;
                    },
                })}
                barStyle={this.state.light_theme ? styles.bottomTabStyleLight : styles.bottomTabStyle}
                activeColor={"tomato"}
                inactiveColor={"#AEB"}//"gray"
                tabBarOptions={{
                    activeTintColor: 'tomato',
                    inactiveTintColor: '#AEB', //'gray
                }}
            >
                <Tab.Screen name="Feed" component={Feed} options={{
                    unmountOnBlur: true
                }} />
                <Tab.Screen name="Criar Postagem" component={CreatePost} options={{
                    unmountOnBlur: true
                }} />
            </Tab.Navigator>
        );
    }
}

const styles = StyleSheet.create({
    bottomTabStyle: {
        backgroundColor: '#15193c',
    },
    bottomTabStyleLight: {
        backgroundColor: "#ACD",
    },
});

//export default BottomTabNavigator;