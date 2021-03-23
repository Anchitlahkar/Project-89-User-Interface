import * as React from "react";
import { View } from "react-native";
import { Header, Icon, Badge } from "react-native-elements";
import db from "../config";
import firebase from "firebase";

export default class MyHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
      userId: firebase.auth().currentUser.email,
    };
  }

  getNumberOfUnreadNotifications = () => {
    db.collection("Notifications")
      .where("NotificationStatues", "==", "unread")
      .where("TargetedUserID", "==", this.state.userId)
      .onSnapshot((snapShot) => {
        var unReadNotifications = snapShot.docs.map((doc) => doc.data());
        this.setState({
          value: unReadNotifications.length,
        });
      });
  };

    BellIconWithBadge=()=>{
      return(
        <View>
          <Icon name='bell' type='font-awesome' color='black' size={25}
            onPress={() =>this.props.navigation.navigate('Notification')}/>
           <Badge
            value={this.state.value}
           containerStyle={{ position: 'absolute', top: -4, right: -4 }}/>
        </View>
      )
    }

  componentDidMount() {
    this.getNumberOfUnreadNotifications();
  }

  render() {
    return (
      <Header
        leftComponent={
          <Icon
            name="bars"
            type="font-awesome"
            color="black"
            onPress={() => {
              this.props.navigation.toggleDrawer();
            }}
          />
        }
        centerComponent={{
          text: this.props.title,
          style: { color: "black", fontSize: 20, fontWeight: "bold" },
        }}
        rightComponent={<this.BellIconWithBadge {...this.props} />}
        backgroundColor="#6f4e37"
      />
    );
  }
}
