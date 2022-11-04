import * as React from 'react';
import { createSwitchNavigator, createAppContainer } from "react-navigation";

import LoginScreen from "./screens/LoginScreen";
import LoadingScreen from "./screens/LoadingScreen";
import DashboardScreen from "./screens/DashboardScreen";

import firebase from "firebase";
import { firebaseConfig } from "./config";

//import 'firebase/database';
//import 'firebase/auth';
//import 'firebase/app';

//if (!firebase.length) {//if (!firebase.app.length) {
//firebase.initializeApp(firebaseConfig);
//} //else {
//firebase.app();
//}

//if (firebase.apps.length === 0) {
//  firebase.app.initializeApp({ firebaseConfig });
//}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

const AppSwitchNavigator = createSwitchNavigator({
  LoadingScreen: LoadingScreen,
  LoginScreen: LoginScreen,
  DashboardScreen: DashboardScreen
})

const AppNavigator = createAppContainer(AppSwitchNavigator)

export default function App() {
  return (
    <AppNavigator />
  );
}