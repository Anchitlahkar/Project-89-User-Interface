import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  FlatList,
} from "react-native";
import MyHeader from "../components/MyHeader";
import db from "../config";
import firebase from "firebase";
import { Input } from "react-native-elements";
import {RFValue} from "react-native-responsive-fontsize"


export default class SettingScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      firstName: "",
      LastName: "",
      contact: "",
      address: "",
      emailId: "",
      docId: "",
    };
  }

  getUserData = () => {
    var user = firebase.auth().currentUser;
    var email = user.email;

    db.collection("Users")
      .where("email", "==", email)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data();
          var name = data.name;
          var fullName = name.split(" ");

          console.log(fullName);

          this.setState({
            emailId: data.email,
            firstName: fullName[0],
            LastName: fullName[1],
            address: data.address,
            contact: data.contact,
            docId: doc.id,
          });
        });
      });
  };

  componentDidMount() {
    console.log("componentDidMount");
    this.getUserData();
  }
  updateUserData = () => {
    db.collection("Users")
      .doc(this.state.docId)
      .update({
        name: this.state.firstName + " " + this.state.LastName,
        contact: this.state.contact,
        address: this.state.address,
      });

    alert('User Details Updated SuccessFully')
  };
  render() {
    return (
      <View>
        <MyHeader title="Settings" navigation={this.props.navigation}/>
        <KeyboardAvoidingView style={styles.KeyboardAvoidingView}>
          <Text
            style={{
              alignSelf: "center",
              fontSize: 20,
              fontWeight: "bold",
              marginTop: 10,
            }}
          >
            User Info
          </Text>
          <Input
            style={styles.formTextInput}
            placeholder={"First Name"}
            label={"First Name"}
            maxLength={8}
            onChangeText={(text) => {
              this.setState({
                firstName: text,
              });
            }}
            value={this.state.firstName}
          />
          <Input
            style={styles.formTextInput}
            placeholder={"Last Name"}
            label={"Last Name"}
            maxLength={8}
            onChangeText={(text) => {
              this.setState({
                LastName: text,
              });
            }}
            value={this.state.LastName}
          />
          <Input
            style={styles.formTextInput}
            placeholder={"Contact"}
            label={"Contact"}
            maxLength={10}
            keyboardType={"numeric"}
            onChangeText={(text) => {
              this.setState({
                contact: text,
              });
            }}
            value={this.state.contact}
          />
          <Input
            style={styles.formTextInput}
            placeholder={"Address"}
            label={"Address"}
            multiline={true}
            onChangeText={(text) => {
              this.setState({
                address: text,
              });
            }}
            value={this.state.address}
          />
          <View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.updateUserData()}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  formTextInput: {
    width: "75%",
    height: RFValue(35),
    alignSelf: "center",
    borderColor: "#ffab91",
    borderRadius: 10,
    borderWidth: 1,
    marginTop: RFValue(20),
    padding: RFValue(10),
  },
  button: {
    width: "50%",
    height: RFValue(50),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#ff5722",
    marginTop: RFValue(20),
    marginLeft: "25%",
  },
  buttonText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#fff",
  },
});
