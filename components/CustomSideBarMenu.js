import * as React from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { DrawerItems } from "react-navigation-drawer";
import firebase from "firebase";
import { Avatar } from "react-native-elements";
import { Icon, Badge } from "react-native-elements";
import db from "../config";
import * as ImagePicker from "expo-image-picker";

export default class CustomSideBarMenu extends React.Component {
  constructor() {
    super();
    this.state = {
      image: "#",
      name: "",
      userId: firebase.auth().currentUser.email,
    };
  }

  getUserProfile = () => {
    db.collection("Users")
      .where("email", "==", this.state.userId)
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            name: doc.data().name,
          });
        });
      });
  };

  fetchImage = (imageName) => {
    var storageRef = firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName);
    storageRef
      .getDownloadURL()
      .then((url) => {
        this.setState({
          image: url,
        });
      })
      .catch((error) => {
        this.setState({
          image: "#",
        });
      });
  };

  uploadImage = async (uri, imageName) => {
    var response = await fetch(uri);
    var blob = await response.blob();
    var ref = firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName);

    return ref.put(blob).then((response) => {
      this.fetchImage(imageName);
    });
  };

  selectPicture = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!cancelled) {
      this.setState({
        image: uri,
      });
      this.uploadImage(uri, this.state.userId);
    }
  };

  componentDidMount() {
    this.getUserProfile();
    this.fetchImage(this.state.userId);
  }

  render() {
    console.log(this.state.userId);
    console.log(this.state.image);

    return (
      <View style={styles.container}>
        <View
          style={{ flex: 0.5, alignItems: "center", backgroundColor: "blue" }}
        >
          <Avatar
            size="xlarge"
            rounded
            source={{
              uri: this.state.image,
            }}
            onPress={() => {
              this.selectPicture();
            }}
            containerStyle={styles.imageContainer}
            activeOpacity={0.7}
            showEditButton
          />
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 20,
              paddingTop: 10,
              color: "white",
              paddingLeft: 25,
            }}
          >
            {this.state.name}
          </Text>
        </View>
        <View style={styles.drawerItemsContainer}>
          <DrawerItems {...this.props} />
        </View>
        <View styles={styles.logOutContainer}>
          <TouchableOpacity
            style={styles.logOutButton}
            onPress={() => {
              this.props.navigation.navigate("HomeScreen");
              firebase.auth().signOut();
            }}
          >
            <Icon name={'logout'} type={'antdesign'} size={20}/>
            <Text style={[styles.logOutText, { marginTop: -20 }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerItemsContainer: {
    flex: 0.8,
  },
  logOutContainer: {
    flex: 0.2,
    justifyContent: "flex-end",
    paddingBottom: 30,
  },
  logOutButton: {
    height: 30,
    width: "100%",
    justifyContent: "center",
    padding: 10,
  },
  logOutText: {
    fontSize: 28,
    fontWeight: "bold",
  },
  imageContainer: {
    marginLeft: 20,
    marginTop: 30,
    borderRadius: 40,
  },
});
