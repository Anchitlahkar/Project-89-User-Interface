import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';

import db from '../config';
import MyHeader from '../components/MyHeader';
import { Input } from 'react-native-elements';
import { RFValue } from 'react-native-responsive-fontsize';

import firebase from 'firebase';

export default class RequestBookScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      itemName: '',
      reasonRequest: '',
      userId: firebase.auth().currentUser.email,
      isItemRequestActive: '',
      requesteditemName: '',
      requestedItemStatus: '',
      requestId: '',
      docId: '',
      currencyCode: '',
      itemValue: 0,
    };
  }

  getItemRequest = () => {
    db.collection('Exchange')
      .where('UserId', '==', this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().item_Status !== 'received') {
            this.setState({
              requesteditemName: doc.data().ItemName,
              requestedItemStatus: doc.data().item_Status,
              docId: doc.id,
              requestId: doc.data().RequestId,
            });
          }
        });
      });
  };

  sendNotification = () => {
    db.collection('Users')
      .where('email', '==', this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var name = doc.data().name;

          db.collection('Notifications')
            .where('RequestId', '==', this.state.requestId)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                var donorId = doc.data().DonorId;
                var itemName = doc.data().itemName;

                db.collection('Notifications').add({
                  TargetedUserID: donorId,
                  ItemName: itemName,
                  Message: name + ' has recived the ' + itemName,
                  NotificationStatues: 'unread',
                });
              });
            });
        });
      });
  };

  getIsItemRequestActive = () => {
    db.collection('Users')
      .where('email', '==', this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            isItemRequestActive: doc.data().isItemRequestActive,
            currencyCode: doc.data().currencyCode,
          });
        });
      });
  };

  updateItemequestStatus = () => {
    db.collection('Exchange').doc(this.state.docId).update({
      item_Status: 'received',
    });

    db.collection('Users')
      .where('email', '==', this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection('Users').doc(doc.id).update({
            isItemRequestActive: false,
          });
        });
      });
  };

  getData = async () => {
    fetch(
      'http://data.fixer.io/api/latest?access_key=b0ce3439b1281d3f0e17f99765d17ccc&format=1'
    )
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        var currencyCode = this.state.currencyCode;
        var Euros = responseData.rates;
        var currency = Euros.INR;

        var value = 69 * currency;

        var finalValue = value * currency;

        console.log('value: ' + value);
        console.log('Currency: ' + currency);
        console.log('Currency Code: ' + currencyCode);
        console.log('Final Value: ' + finalValue);

        this.setState({
          itemValue: value,
        });
      });
  };

  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }

  addRequest = (itemName, reason) => {
    var userId = this.state.userId;
    var randomRequestId = this.createUniqueId();

    if (itemName !== '') {
      if (reason !== '') {
        db.collection('Exchange').add({
          UserId: userId,
          RequestId: randomRequestId,
          ItemName: itemName,
          Reason: reason,
          item_Status: 'requested',
          date: firebase.firestore.FieldValue.serverTimestamp(),
        });

        db.collection('Users')
          .where('email', '==', this.state.userId)
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              db.collection('Users').doc(doc.id).update({
                isItemRequestActive: true,
              });
            });
          });

        this.setState({
          itemName: '',
          reasonRequest: '',
        });
        alert('Item Requested Successfully');
      } else {
        alert('Please Write Your Reason');
      }
    } else {
      alert('Please Write Your Item Name');
    }
  };

  componentDidMount() {
    this.getIsItemRequestActive();
    this.getItemRequest();
    this.getData();
  }

  render() {
    if (this.state.isItemRequestActive === true) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <View
            style={{
              borderColor: 'orange',
              borderWidth: 2,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
              margin: 10,
            }}>
            <Text>Item Name:</Text>
            <Text> {this.state.requesteditemName}</Text>
          </View>
          <View
            style={{
              borderColor: 'orange',
              borderWidth: 2,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
              margin: 10,
            }}>
            <Text>Item Value:</Text>
            <Text>{this.state.itemValue}</Text>
          </View>
          <View
            style={{
              borderColor: 'orange',
              borderWidth: 2,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
              margin: 10,
            }}>
            <Text>Item Status:</Text>
            <Text>{this.state.requestedItemStatus}</Text>
          </View>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: 'orange',
              backgroundColor: 'orange',
              width: 300,
              alignSelf: 'center',
              alignItems: 'center',
              height: 30,
              marginTop: 30,
            }}
            onPress={() => {
              this.updateItemequestStatus();
              this.sendNotification();
              alert('Please Reload The App');
            }}>
            <Text>I Received the Item</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View>
          <MyHeader title="Request Book" navigation={this.props.navigation} />
          <KeyboardAvoidingView style={styles.keyboardAvoidingViewStyle}>
            <Input
              style={styles.textInputStyle}
              placeholder="Enter Item Name"
              label="Enter Item Name"
              onChangeText={(text) => {
                this.setState({ itemName: text });
              }}
              value={this.state.itemName}
            />

            <Input
              style={[styles.textInputStyle, { height: 300 }]}
              placeholder="Why Do You Need The Item??"
              lab="Why Do You Need The Item??"
              onChangeText={(text) => {
                this.setState({ reasonRequest: text });
              }}
              value={this.state.reasonRequest}
              multiline={true}
              numberOfLines={10}
            />

            <TouchableOpacity
              style={styles.requestStyle}
              onPress={() => {
                this.addRequest(this.state.itemName, this.state.reasonRequest);
              }}>
              <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Request</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      );
    }
  }
}
const styles = StyleSheet.create({
  keyboardAvoidingViewStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputStyle: {
    width: '75%',
    height: RFValue(35),
    alignSelf: 'center',
    borderColor: '#ffab91',
    borderRadius: 30,
    borderWidth: 1,
    marginTop: RFValue(20),
    padding: RFValue(10),
  },
  requestStyle: {
    width: '50%',
    height: RFValue(40),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: 'gold',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop: RFValue(60),
  },
});
