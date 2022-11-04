import React, { Component } from 'react';
import { Text, View, Image, StyleSheet, Platform, SafeAreaView } from 'react-native';

import { RFValue } from "react-native-responsive-fontsize";
import { FlatList } from "react-native-gesture-handler";
import { StatusBar } from 'expo-status-bar';

import PostCard from "./PostCard";

let posts = require("./temp_posts.json");

import firebase from 'firebase';

export default class Feed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            light_theme: false,
            posts: [],
        }
    }

    componentDidMount() {
        this.fetchUser();
        this.fetchPosts();
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

    fetchPosts = () => {
        firebase
            .database()
            .ref('/posts/')
            .on(
                'value',
                (snapshot) => {
                    let posts = [];
                    if (snapshot.val()) {
                        Object.keys(snapshot.val()).forEach(function (key) {
                            posts.push({
                                key: key,
                                value: snapshot.val()[key],
                            });
                        });
                    }
                    this.setState({ posts: posts });
                },
                function (errorObject) {
                    console.log('A leitura Falhou' + errorObject.code);
                }
            );
    };

    renderItem = ({ item: posts }) => {
        return <PostCard post={posts} navigation={this.props.navigation} />;
    };

    keyExtractor = (item, index) => index.toString();

    render() {
        return (
            <View style={this.state.light_theme ? styles.containerLight : styles.container}>
                <SafeAreaView style={styles.droidSafeArea} />
                <View style={styles.appTitle}>
                    <View style={styles.appIcon}>
                        <Image
                            source={require("../assets/logo2.png")}
                            style={styles.iconImage}
                        ></Image>
                    </View>
                    <View style={styles.appTitleTextContainer}>
                        <Text style={styles.appTitleText}>Espectagrama</Text>
                    </View>
                </View>
                <View style={styles.cardContainer}>
                    <FlatList
                        keyExtractor={this.keyExtractor}
                        data={this.state.posts}//posts
                        renderItem={this.renderItem}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "darkblue", //black
    },
    containerLight: {
        flex: 1,
        backgroundColor: "#ACD", //"white"
    },
    droidSafeArea: {
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
    },
    appTitle: {
        flex: 0.7,
        flexDirection: "row",
    },
    appIcon: {
        flex: 0.2,
        justifyContent: "center",
        alignItems: "center",
        height: "25%" //eu
    },
    iconImage: {
        width: "310%", //"100%" //"170"
        height: "310%", //"100%" //"170"
        resizeMode: "contain",
    },
    appTitleTextContainer: {
        flex: 0.8,
        justifyContent: "center",
        height: "25%", //eu
    },
    appTitleText: {
        color: "#ABE493", //"white" //ABE //ABE493
        fontSize: RFValue(28), //RFValue(28)
    },
    cardContainer: {
        flex: 2.8, //0.85 //2.25
    }
});