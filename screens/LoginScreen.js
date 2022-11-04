import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image, Platform, StatusBar, SafeAreaView }
    from 'react-native';

import * as Google from 'expo-google-app-auth';
import firebase from 'firebase';
import { RFValue } from 'react-native-responsive-fontsize';

import Constants from 'expo-constants';
//console.log(Constants.systemFonts);

import * as Font from 'expo-font';

let customFonts = {
    'Bubblegum-Sans': require('../assets/fonts/BubblegumSans-Regular.ttf'),
};

export default class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fontsLoaded: false,
        };
    }
    async _loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true });
    }

    componentDidMount() {
        this._loadFontsAsync();
    }

    isUserEqual = (googleUser, firebaseUser) => {
        if (firebaseUser) {
            var providerData = firebaseUser.providerData;
            for (var i = 0; i < providerData.length; i++) {
                if (
                    providerData[i].providerId ===
                    firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                    providerData[i].uid === googleUser.getBasicProfile().getId()
                ) {
                    // We don't need to reauth the Firebase connection.
                    return true;
                }
            }
        }
        return false;
    };

    onSignIn = (googleUser) => {
        console.log(googleUser);
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
            unsubscribe();
            // Check if we are already signed-in Firebase with the correct user.
            if (!this.isUserEqual(googleUser, firebaseUser)) {
                // Build Firebase credential with the Google ID token.
                console.log('here');
                var credential = firebase.auth.GoogleAuthProvider.credential(
                    googleUser.idToken,
                    googleUser.accessToken
                );
                console.log('here cred is ' + credential);
                // Sign in with credential from the Google user.
                firebase
                    .auth()
                    .signInWithCredential(credential)
                    .then(function (result) {
                        if (result.additionalUserInfo.isNewUser) {
                            firebase
                                .database()
                                .ref('/users/' + result.user.uid)
                                .set({
                                    gmail: result.user.email,
                                    profile_picture: result.additionalUserInfo.profile.picture,
                                    locale: result.additionalUserInfo.profile.locale,
                                    first_name: result.additionalUserInfo.profile.given_name,
                                    last_name: result.additionalUserInfo.profile.family_name,
                                    current_theme: 'dark',
                                })
                                .then(function (snapshot) { });
                        }
                    })
                    .catch((error) => {
                        // Handle Errors here.
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        // The email of the user's account used.
                        var email = error.email;
                        // The firebase.auth.AuthCredential type that was used.
                        var credential = error.credential;
                        // ...
                    });
            } else {
                console.log('User already signed-in Firebase.');
            }
        });
    };

    signInWithGoogleAsync = async () => {
        try {
            const result = await Google.logInAsync({
                behaviour: 'web',

                androidClientId:
                    '1085103925529-d77cbp3ese3k94i5lqju55sqf7s8a3s2.apps.googleusercontent.com',

                iosClientId:
                    '1085103925529-rr4pd1cvafaup0skb6kmrj1rj08qc5vu.apps.googleusercontent.com',

                scopes: ['profile', 'email'],
            });
            console.log(result.type);
            if (result.type === 'success') {
                console.log('success here');
                this.onSignIn(result);
                return result.accessToken;
            } else {
                return { cancelled: true };
            }
        } catch (e) {
            console.log(e.message);
            return { error: true };
        }
    };

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: "#15193c",
                }}>
                <SafeAreaView style={styles.droidSafeArea} />
                <View style={styles.appTitle}>
                    <View style={styles.appIcon}>
                        <Image
                            source={require("../assets/logo2.png")}
                            style={styles.iconImage}
                        ></Image>
                    </View>
                    <Text style={styles.appTitleText}>{`Espectagrama`}</Text>
                </View>
                {/*<Text>LoginScreen</Text>*/}
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => this.signInWithGoogleAsync()}>
                    <Image
                        source={require("../assets/google_icon.png")}
                        style={styles.googleIcon}
                    >
                    </Image>
                    <Text style={styles.loginButtonText}>Login Com O Google</Text>
                </TouchableOpacity>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    droidSafeArea: {
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
    },
    loginButton: {
        width: '80%',
        height: '10%',
        borderRadius: RFValue(35),
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        flexDirection: 'row',
    },
    loginButtonText: {
        fontSize: RFValue(30),
        color: 'purple',
        flex: 1.2,
        fontFamily: Platform.OS === "web" ? "Bubblegum-Sans" : "Baskerville",
    },
    googleIcon: {
        width: RFValue(30),
        height: RFValue(30),
        resizeMode: 'contain',
        flex: 0.5,
        flexDirection: 'row',
    },
    appTitle: {
        flex: 0.7,
        flexDirection: "row",
    },
    appIcon: {
        justifyContent: "center",
        alignItems: "center",
        flex: 0.5,
        width: "100%",
        height: "10%", //eu // "25%"
        marginRight: RFValue(20),
    },
    iconImage: {
        width: "230%", //"100%"
        height: "270%", //"100%"
        resizeMode: "contain",
    },
    appTitleTextContainer: {
        flex: 0.8,
        justifyContent: "center",
        height: "25%" //eu
    },
    appTitleText: {
        color: "#ABE493", //"white" //ABE //ABE493
        fontSize: RFValue(28),
    },
});
