import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import firebase from "firebase";
import { ScrollView } from "react-native-gesture-handler";
import db from "../config";
import { Input, Icon } from "react-native-elements";
import {RFValue} from "react-native-responsive-fontsize"

export default class WelcomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      address: "",
      contact: "",
      confirmPassword: "",
      currencyCode: "",
      isModalVisible: false,
    };
  }

  userLogin = (email, password) => {
    console.log("Login:  " + email + " : " + password);
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.props.navigation.navigate("Homescreen");
      })
      .catch(function (error) {
        console.log(error);
        var errorMessage = error.message;
        return alert(errorMessage);
      });
  };

  userSignUp = (email, password, confirmPassword) => {
    console.log("SignUp:  " + email + " : " + password);

    if (password !== confirmPassword) {
      return alert("Check Your Password");
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          db.collection("Users").add({
            name: this.state.firstName + " " + this.state.lastName,
            contact: this.state.contact,
            address: this.state.address,
            email: this.state.email,
            currencyCode: this.state.currencyCode,
            isBookRequestActive: false,
          });
          return alert("User Add Successfully", "", [
            {
              text: "OK",
              onPress: () => this.setState({ isModalVisible: false }),
            },
          ]);
        })
        .catch(function (error) {
          console.log(error);
          var errorMessage = error.message;
          return alert(errorMessage);
        });
    }
  };

  showModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.isModalVisible}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={{ width: "100%" }}>
            <KeyboardAvoidingView style={styles.KeyboardAvoidingView}>
              <Text style={styles.modalTitle}>Registration</Text>
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
              />
              <Input
                style={styles.formTextInput}
                placeholder={"Last Name"}
                label={"Last Name"}
                maxLength={8}
                onChangeText={(text) => {
                  this.setState({
                    lastName: text,
                  });
                }}
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
              />
              <Input
                style={styles.formTextInput}
                placeholder={"Currency Code"}
                label={"Currency Code"}
                maxLength={8}
                onChangeText={(text) => {
                  this.setState({
                    currencyCode: text,
                  });
                }}
              />
              <Input
                style={styles.formTextInput}
                placeholder={"Email"}
                label={"Email"}
                keyboardType={"email-address"}
                onChangeText={(text) => {
                  this.setState({
                    email: text,
                  });
                }}
              />
              <Input
                style={styles.formTextInput}
                placeholder={"Password"}
                label={"Password"}
                secureTextEntry={true}
                onChangeText={(text) => {
                  this.setState({
                    password: text,
                  });
                }}
              />
              <Input
                style={styles.formTextInput}
                placeholder={"Confrim Password"}
                label={"Confrim Password"}
                secureTextEntry={true}
                onChangeText={(text) => {
                  this.setState({
                    confirmPassword: text,
                  });
                }}
              />
              <View>
                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={() =>
                    this.userSignUp(
                      this.state.email,
                      this.state.password,
                      this.state.confirmPassword
                    )
                  }
                >
                  <Text style={styles.registerButtonText}>Register</Text>
                </TouchableOpacity>
              </View>

              <View>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => this.setState({ isModalVisible: false })}
                >
                  <Icon
                    name={"cancel"}
                    type={"metirialicon"}
                    size={25}
                    color={"red"}
                    onPress={() => this.setState({ isModalVisible: false })}
                  />
                  <Text style={{ color: "#ff5722" }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  render() {
    return (
      <View style={styles.mainView}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>Barter System</Text>
        </View>

        <Image style={styles.logo} source={require("../assets/download.jpg")} />
        {this.showModal()}

        <Input
          style={[styles.textInputStyle]}
          placeholder="    Email ID"
          label="    Email ID"
          keyboardType="email-address"
          onChangeText={(text) => {
            this.setState({
              email: text,
            });
          }}
        />
        <Input
          style={styles.textInputStyle}
          placeholder="    Password"
          label="    Password"
          secureTextEntry={true}
          onChangeText={(text) => {
            this.setState({
              password: text,
            });
          }}
        />

        <TouchableOpacity
          style={styles.ButtonStyle}
          onPress={() => {
            this.userLogin(this.state.email, this.state.password);
          }}
        >
          <Text style={styles.ButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.ButtonStyle}
          onPress={() => {
            // this.showModal();
            this.setState({
              isModalVisible: true,
            });
          }}
        >
          <Text style={styles.ButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    height: "100%",
    alignItems: "center",
    width: "100%",
  },
  textInputStyle: {
    margin: RFValue(20),
    borderRadius: 15,
    height: 35,
    width: "80%",
    borderBottomWidth: 5,
    backgroundColor: "lightgrey",
  },
  textContainer: {
    backgroundColor: "#464840",
    width: "100%",
  },
  text: {
    color: "white",
    padding: RFValue(20),
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  ButtonStyle: {
    backgroundColor: "blue",
    padding: RFValue(10),
    borderRadius: 10,
    margin: RFValue(10),
    width: 100,
    height: 35,
    marginLeft: RFValue(10),
  },
  ButtonText: {
    fontSize: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffff",
    marginRight: RFValue(30),
    marginLeft: RFValue(30),
    marginTop: RFValue(80),
    marginBottom: RFValue(80),
  },
  KeyboardAvoidingView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    justifyContent: "center",
    alignSelf: "center",
    fontSize: 30,
    color: "brown",
    margin: RFValue(50),
  },

  formTextInput: {
    width: "75%",
    height: 35,
    alignSelf: "center",
    borderColor: "#ffab91",
    borderRadius: 10,
    borderWidth: 1,
    marginTop: RFValue(20),
    padding: RFValue(10),
  },
  registerButton: {
    width: 200,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: RFValue(30),
  },
  registerButtonText: {
    color: "#ff5722",
    fontSize: 15,
    fontWeight: "bold",
  },
  cancelButton: {
    width: 200,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 5,
  },
});
