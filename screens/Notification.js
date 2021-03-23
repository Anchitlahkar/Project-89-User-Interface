import * as React from "react";
import {
  View,
  StyleSheet,
  FlatList,
} from "react-native";
import  MyHeader  from "../components/MyHeader";
import db from "../config";
import firebase from "firebase";
import { ListItem } from "react-native-elements";
import SwipeAbleFlatList from "../components/SwipeAbleFlatList"
import {RFValue} from "react-native-responsive-fontsize"


export default class NotificationScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      allNotifications: [],
      userId: firebase.auth().currentUser.email,
    };
    this.notificationRef = null;
  }

  getNotification = () => {
    this.notificationRef = db
      .collection("Notifications")
      .where("NotificationStatues", "==", "unread")
      .where("TargetedUserID", "==", this.state.userId)
      .onSnapshot((snapshot) => {
        var allNotification = [];
        snapshot.docs.map((doc) => {
          var notification = doc.data();
          allNotification.push(notification);
        });
        this.setState({
          allNotifications: allNotification,
        });
      });
  };

  componentDidMount() {
    this.getNotification();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 0.1 }}>
          <MyHeader title="Notification" navigation={this.props.navigation}/>
        </View>
        <View>
        <SwipeAbleFlatList allNotifications={this.state.allNotifications} />
        
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
