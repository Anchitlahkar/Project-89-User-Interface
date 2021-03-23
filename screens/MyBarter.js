import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import MyHeader from "../components/MyHeader";
import db from "../config";
import firebase from "firebase";
import { ListItem } from "react-native-elements";
import {RFValue} from "react-native-responsive-fontsize"


export default class MyDonationScreen extends React.Component {
  constructor() {
    super();

    this.state = {
      ExchengerId: firebase.auth().currentUser.email,
      allExchanges: [],
      donorName: "",
    };
    this.requestRef = null;
  }

  getDonorDetails = (ExchengerId) => {
    db.collection("Users")
      .where("email", "==", ExchengerId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            donorName: doc.data().name,
          });
        });
      });
  };

  getAllDonations = () => {
    this.requestRef = db
      .collection("allExchange")
      .where("ExchengerId", "==", this.state.ExchengerId)
      .onSnapshot((snapshot) => {
        var allExchanges = snapshot.docs.map((doc) => doc.data());
        this.setState({
          allExchanges: allExchanges,
        });
      });
  };

  sendItem = (ItemDetails) => {
    var requestStatus = "Book Sent";

    db.collection("allExchange").doc(ItemDetails.doc_id).update({
      requestStatus: requestStatus,
    });
    this.sendNotification(ItemDetails, requestStatus);
  };

  sendNotification = (ItemDetails, requestStatus) => {
    var requestId = ItemDetails.RequestId;
    var ExchengerId = ItemDetails.DonorId;

    db.collection("Notifications")
      .where("RequestId", "==", requestId)
      .where("ExchengerId", "==", ExchengerId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var message = "";
          if (requestStatus === "Book Sent") {
            message = this.state.donorName + " Sent The Book";
          } else {
            this.state.donorName + " has shown intrested in donating the book";
          }
          db.collection("Notifications").doc(doc.id).update({
            Message: message,
            NotificationStatues: "unread",
            Date: firebase.firestore.FieldValue.serverTimestamp(),
          });
        });
      });
  };

  componentDidMount() {
    this.getAllDonations();
    this.getDonorDetails(this.state.ExchengerId);
  }
  render() {
    return (
      <View>
        <MyHeader title="My Exchange" navigation={this.props.navigation}/>

        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={this.state.allExchanges}
          renderItem={({ item, i }) => {
            return (
              <ListItem
                key={i}
                title={item.ItemName}
                subtitle={
                  "Requested By: " +
                  item.requestedBy +
                  "\nStatus: " +
                  item.requestStatus
                }
                titleStyle={{ color: "black", fontWeight: "bold" }}
                rightElement={
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      this.sendItem(item);
                    }}
                  >
                    <Text style={{ color: "#ffff" }}>Exchange</Text>
                  </TouchableOpacity>
                }
                bottomDivider
              />
            );
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: RFValue(100),
    height:RFValue(30),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
  },
});
