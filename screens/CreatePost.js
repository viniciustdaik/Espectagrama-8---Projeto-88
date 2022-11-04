import React, { Component } from "react";
import {
    StyleSheet, Text, View, Image,
    SafeAreaView, StatusBar, Platform, TextInput, ScrollView,
    Button, TouchableOpacity, KeyboardAvoidingView, Alert
}
    from "react-native";

import { RFValue } from "react-native-responsive-fontsize";
import DropDownPicker from "react-native-dropdown-picker";

var maxDropDownHeight = 210;//170

import firebase from 'firebase';

export default class CreateStory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            previewImage: "image_1",
            dropdownHeight: 40,
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

    async addPost() {
        if (
            this.state.caption
        ) {
            let postData = {
                preview_images: this.state.previewImage,
                caption: this.state.caption,
                author: firebase.auth().currentUser.displayName,
                create_on: new Date(),
                author_uid: firebase.auth().currentUser.uid,
                likes: 0
            }

            await firebase
                .database()
                .ref(
                    "/posts/" +
                    Math.random()
                        .toString(36)
                        .slice(2)
                )
                .set(postData)
                .then(function (snapshot) { })
            this.props.setUpdateTotrue();
            this.props.navigation.navigate("Feed")
        } else {
            Alert.alert(
                "Error",
                "Todos os campos são obrigatórios!",
                [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                { cancelable: false }
            )
        }
    }

    render() {
        let preview_images = {
            image_1: require("../assets/image_1.jpg"),
            image_2: require("../assets/image_2.jpg"),
            image_3: require("../assets/image_3.jpg"),
            image_4: require("../assets/image_4.jpg"),
            image_5: require("../assets/image_5.jpg"),
            image_6: require("../assets/image_6.jpg"),
            image_7: require("../assets/image_7.jpg"),
        }
        console.log(this.state.previewImage);
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
                        <Text style={styles.appTitleText}>Novo Post</Text>
                    </View>
                </View>
                <View style={styles.fieldsContainer}>
                    {/*<ScrollView>*/}
                    <Image
                        source={preview_images[this.state.previewImage]}
                        style={styles.previewImage}
                    ></Image>
                    <View style={{ height: RFValue(this.state.dropdownHeight) }}>
                        <DropDownPicker
                            items={[
                                { label: "Image 1", value: "image_1" },
                                { label: "Image 2", value: "image_2" },
                                { label: "Image 3", value: "image_3" },
                                { label: "Image 4", value: "image_4" },
                                { label: "Image 5", value: "image_5" },
                                { label: "Image 6", value: "image_6" },
                                { label: "Image 7", value: "image_7" },
                            ]}
                            defaultValue={this.state.previewImage}
                            containerStyle={{
                                height: 40,
                                width: "90%", //eu
                                marginLeft: RFValue(15), //eu
                                borderRadius: 20,
                                marginBottom: 10
                            }}
                            open={this.state.dropdownHeight == 170 ? true : false}
                            onOpen={() => {
                                this.setState({ dropdownHeight: 170 });
                            }}
                            onClose={() => {
                                this.setState({ dropdownHeight: 40 });
                            }}
                            style={{ backgroundColor: "transparent" }}
                            itemStyle={{ justifyContent: "flex-start" }}
                            dropDownStyle={{ backgroundColor: "#2a2a2a" }}
                            labelStyle={{ color: "white" }}
                            arrowStyle={{ color: "white" }}
                            onChangeItem={item => {
                                /*onSelectItem={(item) => {*/
                                this.setState({
                                    previewImage: item.value
                                });
                            }}
                        />
                    </View>

                    <TextInput
                        style={styles.inputFont}
                        onChangeText={caption => this.setState({ caption })}
                        placeholder={"Legenda"}
                        numberOfLines={3}
                        placeholderTextColor="white"
                    />

                    <View style={styles.submitButton}>
                        <TouchableOpacity
                            onPress={() => this.addPost()}
                            //title="Submit"
                            //color="#841584"
                            backgroundColor="#841584"
                        >
                            <Text style={[styles.submitButtonText, { width: "80%", }]}>
                                Criar</Text>
                        </TouchableOpacity>
                    </View>

                    {/*</ScrollView>*/}
                </View>
                <View style={{ flex: 0.08 }}></View>
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
        backgroundColor: "#ACD",
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
        width: "270%", //"100%" //"170%"
        height: "270%", //"100%" //"170%"
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
    fieldsContainer: {
        flex: 2.5,//0.85
    },
    previewImage: {
        width: "93%",
        height: RFValue(300),//250
        alignSelf: "center",
        borderRadius: RFValue(10),
        marginVertical: RFValue(10),
        resizeMode: "contain",
    },
    inputFont: {
        width: "90%", //eu
        marginLeft: RFValue(15),//eu
        height: RFValue(40),
        borderColor: "white",
        borderWidth: RFValue(1),
        borderRadius: RFValue(10),
        paddingLeft: RFValue(10),
        color: "white",
        marginTop: RFValue(10),
    },
    submitButton: {
        marginTop: RFValue(20),
        alignItems: "center",
        justifyContent: "center",
        borderRadius: RFValue(30),
        backgroundColor: "orange", //eu //"orange"
        width: "80%", //eu
        alignSelf: "center", //eu
        height: RFValue(35), //eu
    },
    submitButtonText: {
        fontSize: RFValue(30), //eu
        color: "#841584",
    }
});