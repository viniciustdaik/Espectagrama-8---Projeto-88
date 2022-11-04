import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Platform,
    StatusBar,
    Image,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    Alert,
} from "react-native";

import { RFValue } from "react-native-responsive-fontsize";
import Ionicons from "react-native-vector-icons/Ionicons";

import firebase from 'firebase';

export default class PostScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            light_theme: false,
            likes: this.props.route.params.post.likes,
            is_liked: false,
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

    likeAction = () => {
        // console.log("this.state.post_id",this.state.post_id)
        if (this.state.is_liked) {
            firebase
                .database()
                .ref('posts')
                .child(this.state.post_id)
                .child('likes')
                .set(firebase.database.ServerValue.increment(-1));
            this.setState({ likes: this.state.likes - 1, is_liked: false });
        } else {
            firebase
                .database()
                .ref('posts')
                .child(this.state.post_id)
                .child('likes')
                .set(firebase.database.ServerValue.increment(1));
            this.setState({ likes: this.state.likes + 1, is_liked: true });
        }
    };

    render() {
        return (
            <View style={this.state.light_theme ? styles.containerLight : styles.container}>
                <SafeAreaView style={styles.droidSafeArea} />
                <ScrollView>
                    <View style={this.state.light_theme ? styles.cardContainerLight :
                        styles.cardContainer}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Tela Inicial")}>
                            <Text style={{
                                width: "100%", height: "15%", fontSize: RFValue(18), backgroundColor: "orange",
                                borderRadius: RFValue(13), overflow: "hidden", alignSelf: "center",
                                textAlign: "center",
                            }}>Voltar</Text>
                        </TouchableOpacity>


                        <View style={styles.authorContainer}>
                            <View style={styles.authorNameContainer}>
                                <Text style={this.state.light_theme ? styles.authorNameTextLight :
                                    styles.authorNameText}>{this.props.route.params.post.author}</Text>
                            </View>
                            <View style={styles.authorImageContainer}>
                                <Image
                                    source={require('../assets/profile_img.png')}
                                    style={styles.profileImage}
                                ></Image>
                            </View>
                            {/*<View style={styles.authorNameContainer}>
                                <Text style={styles.authorNameText}>{this.props.route.params.post.author}</Text>
                        </View>*/}
                        </View>
                        <Text style={styles.captionText}>
                            {this.props.route.params.post.caption}
                        </Text>
                        <Image source={require('../assets/post.jpeg')} style={styles.postImage} />
                        <View style={styles.captionContainer}>
                            {/*<Text style={styles.captionText}>
                                {this.props.route.params.post.caption}
                    </Text>*/}
                        </View>
                        <View style={styles.actionContainer}>
                            <TouchableOpacity
                                onPress={() => this.likeAction()}>
                                <View style={!this.state.is_liked ? styles.likeButtonDisliked : styles.likeButtonLiked}>
                                    <Ionicons name={"heart"} size={RFValue(30)} color={"white"} />
                                    <Text style={styles.likeText}>{this.state.likes/*12k*/}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    droidSafeArea: {
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
    },
    container: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "darkblue", //black
    },
    containerLight: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ACD", //"white"
    },
    cardContainer: {
        margin: RFValue(13),
        backgroundColor: "#3CB371", //#3CB371
        borderRadius: RFValue(30),
        width: "95%", //eu 
    },
    cardContainerLight: {
        margin: RFValue(13),
        backgroundColor: "#3AA141",
        borderRadius: RFValue(30),
        width: "95%", //eu 
    },
    /**/authorContainer: {
        margin: RFValue(5),//13
        backgroundColor: "#3CB371", //#3CB371
        borderRadius: RFValue(30),
    },
    postImage: {
        width: "95%", //eu 
        alignSelf: 'center', //eu
        //borderRadius: RFValue(5), //eu
    },
    profileImage: {
        width: "100%", //eu 
        //height: "55%", //eu
        //marginTop: 350, //eu
    },
    /**/authorImageContainer: {
        margin: RFValue(5),//13
        backgroundColor: "#3CB371", //#3CB371
        borderRadius: RFValue(30),
        width: "100%", //eu 
        marginLeft: 0, //eu
    },
    /**/authorNameContainer: {
        margin: RFValue(13),
        backgroundColor: "#3CB371", //#3CB371
        borderRadius: RFValue(30),
    },
    /**/captionContainer: {
        margin: RFValue(13),
        backgroundColor: "#3CB371", //#3CB371
        borderRadius: RFValue(30),
    },
    authorNameText: {
        fontSize: RFValue(25), //18
        color: "white", //white
    },
    authorNameTextLight: {
        color: "#ACD",
        fontSize: RFValue(25),
    },
    captionText: {
        margin: RFValue(5), //eu
        fontSize: RFValue(25), //13
        color: "#EBC205", //white //EBC205 //EBC
        paddingTop: RFValue(10),
    },
    actionContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: RFValue(50),
    },
    likeButton: {
        width: RFValue(160),
        height: RFValue(50),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "row",
        backgroundColor: "#EB3948", //#EB3948
        borderRadius: RFValue(40),
    },
    likeText: {
        color: "white", //white
        fontSize: RFValue(25),
        marginLeft: RFValue(4),
    },
    likeButtonLiked: {
        width: RFValue(160),
        height: RFValue(40),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#eb3948',
        borderRadius: RFValue(30),
    },
    likeButtonDisliked: {
        width: RFValue(160),
        height: RFValue(40),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderColor: '#eb3948',
        borderWidth: 2,
        borderRadius: RFValue(30),
    },
});
