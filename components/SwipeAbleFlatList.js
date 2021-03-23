import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  Animated,
} from "react-native";
import db from "../config";
import { ListItem, Icon } from "react-native-elements";
import { SwipeListView } from "react-native-swipe-list-view";

export default class SwipeAbleFlatList extends React.Component {
  constructor(props) {
    super(props);

    this.notifications = this.props.allNotifications;

    this.state = {
      allNotifications: this.props.allNotifications,
    };
  }

  updateMarkAsread = (notification) => {
    db.collection("Notifications").doc(notification.doc_id).update({
      NotificationStatues: "read",
    });
  };

  onSwipeValueChange = (swipeData) => {
    var allNotifications = this.props.allNotifications;
    const { key, value } = swipeData;
    console.log(value)
    if (value < -Dimensions.get("window").width) {
      const newData = [...allNotifications];
      this.updateMarkAsread(allNotifications[key]);
      newData.splice(key, 1);
      this.setState({ allNotifications: newData });
    }
  };
  renderItem = (data) => (
    <Animated.View>
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Title style={{ color: "black", fontWeight: "bold" }}>
            {data.item.BookName}
          </ListItem.Title>
          <ListItem.Subtitle>{data.item.Message}</ListItem.Subtitle>
          <Icon name="book" type="font-awesome" color="#696969" />
        </ListItem.Content>
      </ListItem>
    </Animated.View>
  );

  renderHiddenItem = () => (
    <View style={styles.rowBack}>
      <View style={[styles.backRightBtn, styles.backRightBtnRight]}>
        <Text style={styles.backTextWhite}>Mark as read</Text>
      </View>
    </View>
  );

  render() {
    console.log(this.props.allNotifications);
    console.log("State" + this.state.allNotifications);
    return (
      <View style={styles.container}>
        <SwipeListView
          disableRightSwipe
          data={this.props.allNotifications}
          renderItem={this.renderItem}
          renderHiddenItem={this.renderHiddenItem}
          rightOpenValue={-Dimensions.get("window").width}
          previewRowKey={"0"}
          previewOpenValue={-40}
          previewOpenDelay={3000}
          onSwipeValueChange={this.onSwipeValueChange}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  backTextWhite: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
    alignSelf: "flex-start",
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#29b6f6",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 100,
  },
  backRightBtnRight: {
    backgroundColor: "#29b6f6",
    right: 0,
  },
});
