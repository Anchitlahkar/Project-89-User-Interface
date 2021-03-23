import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  FlatList,
} from 'react-native';
import { Card } from 'react-native-elements';
import db from '../config';
import firebase from 'firebase';
import { RFValue } from 'react-native-responsive-fontsize';

export default class ReceiverDetailsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: firebase.auth().currentUser.email,
      receiverId: this.props.navigation.getParam('details')['UserId'],
      requestId: this.props.navigation.getParam('details')['RequestId'],
      itemName: this.props.navigation.getParam('details')['ItemName'],
      reason: this.props.navigation.getParam('details')['Reason'],
      receiverName: '',
      receiverContact: '',
      receiverAddress: '',
      receiverRequestDocId: '',
      userName: '',
    };
  }

  getReceiverDetails = () => {
    db.collection('Users')
      .where('email', '==', this.state.receiverId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data();
          var name = data.name;

          console.log(data.contact);

          this.setState({
            receiverName: name,
            receiverContact: data.contact,
            receiverAddress: data.address,
          });
        });
      });

    db.collection('BookRequest')
      .where('RequestId', '==', this.state.requestId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            receiverRequestDocId: doc.id,
          });
        });
      });
  };

  updateBookStatus = () => {
    db.collection('allExchange').add({
      ItemName: this.state.itemName,
      RequestId: this.state.requestId,
      requestedBy: this.state.receiverName,
      ExchengerId: this.state.userId,
      requestStatus: 'Exchenger intrested',
    });
  };

  getUserDetails = (userId) => {
    db.collection('Users')
      .where('email', '==', userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            userName: doc.data().name,
          });
        });
      });
  };

  addNotifications = () => {
    var message =
      this.state.userName +
      ' ' +
      'has shown intrested in donating ' +
      this.state.itemName;

    db.collection('Notifications').add({
      TargetedUserID: this.state.receiverId,
      ExchengerId: this.state.userId,
      RequestId: this.state.requestId,
      itemName: this.state.itemName,
      Date: firebase.firestore.FieldValue.serverTimestamp(),
      NotificationStatues: 'unread',
      Message: message,
    });
  };

  componentDidMount = () => {
    this.getReceiverDetails();
    this.getUserDetails(this.state.userId);
  };

  render() {
    return (
      <View>
        <View>
          <Card title={'Book Information'} titleStyle={{ fontSize: 20 }}>
            <Card>
              <Text style={{ fontWeight: 'bold' }}>
                Name: {this.state.itemName}
              </Text>
            </Card>
            <Card>
              <Text style={{ fontWeight: 'bold' }}>
                Reason: {this.state.reason}
              </Text>
            </Card>
          </Card>
        </View>
        <View>
          <Card title={'Receiver Information'} titleStyle={{ fontSize: 20 }}>
            <Card>
              <Text style={{ fontWeight: 'bold' }}>
                Name: {this.state.receiverName}
              </Text>
            </Card>
            <Card>
              <Text style={{ fontWeight: 'bold' }}>
                Contact: {this.state.receiverContact}
              </Text>
            </Card>
            <Card>
              <Text style={{ fontWeight: 'bold' }}>
                Address: {this.state.receiverAddress}
              </Text>
            </Card>
          </Card>
        </View>
        <View style={styles.buttonContainer}>
          {this.state.receiverId !== this.state.userId ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.updateBookStatus();
                this.addNotifications();
                this.props.navigation.navigate('MyBarter');
              }}>
              <Text style={{ color: 'white', fontWeight: 'Bold' }}>
                I Want To Exchange{' '}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 0.3,
    justifyContent: 'center',

    alignItems: 'center',
  },
  button: {
    width: RFValue(200),
    height: RFValue(50),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'blue',
    margin: RFValue(10),
  },
});
