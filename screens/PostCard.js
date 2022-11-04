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
} from "react-native";

import { RFValue } from "react-native-responsive-fontsize";
import Ionicons from "react-native-vector-icons/Ionicons";

import firebase from "firebase";

export default class PostCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            light_theme: false,
            post_id: this.props.post.key,
            post_data: this.props.post.value,
            is_liked: false,
            likes: this.props.post.value.likes,
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
        let post = this.state.post_data;
        return (
            <View style={styles.container}>
                <View style={this.state.light_theme ? styles.cardContainerLight :
                    styles.cardContainer}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("Tela de Posts", {
                        navigation: this.props.navigation,
                        post: post,
                        post_id: this.state.post_id, //post: this.props.post
                    })}>

                        <View style={styles.authorContainer}>
                            <View style={styles.authorImageContainer}>
                                <Image
                                    source={require('../assets/profile_img.png')}
                                    style={styles.profileImage}
                                ></Image>
                            </View>
                            <View style={styles.authorNameContainer}>
                                <Text style={this.state.light_theme ? styles.authorNameTextLight :
                                    styles.authorNameText}>{post.author/* this.props.post.author */}</Text>
                            </View>
                        </View>
                        <Image source={require('../assets/post.jpeg')} style={styles.postImage} />
                        <View style={styles.captionContainer}>
                            <Text style={styles.captionText}>
                                {post.caption/*this.props.post.caption */}
                            </Text>
                        </View>



                    </TouchableOpacity>

                    <View style={styles.actionContainer}>
                        <TouchableOpacity
                            onPress={() => this.likeAction()}>
                            <View style={!this.state.is_liked ? styles.likeButton : styles.likeButtonLiked}>
                                <Ionicons name={"heart"} size={RFValue(30)} color={"white"} />
                                <Text style={styles.likeText}>{this.state.likes/*12k*/}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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
        margin: RFValue(13),
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
        margin: RFValue(13),
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
        fontSize: RFValue(25), //13
        color: "#EBC205", //white //EBC205 //EBC
        paddingTop: RFValue(10),
        marginLeft: RFValue(5), //eu
        marginBottom: RFValue(10), //eu
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
});
