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
import MyHeader from '../components/MyHeader';
import db from '../config';
import firebase from 'firebase';
import { ListItem } from 'react-native-elements';
import ReceiverDetails from './ReceiverDetailsScreen';
import {RFValue} from "react-native-responsive-fontsize"


export default class DonatetBookScreen extends React.Component {
  constructor() {
    super();

    this.state = {
      requestedItemList: '',
    };
    this.requestRef = null;
  }

  getrequestedItemList = () => {
    this.requestRef = db.collection('Exchange').onSnapshot((snapshot) => {
      var requestedItemList = snapshot.docs.map((document) => document.data());
      this.setState({
        requestedItemList: requestedItemList,
      });
    });
  };

  componentDidMount = () => {
    this.getrequestedItemList();
  };

  render() {
    console.log(this.state.requestedItemList);
    return (
      <View>
        <MyHeader title="Exchange Item" navigation={this.props.navigation}/>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={this.state.requestedItemList}
          renderItem={({ item, i }) => {
            return (
              <ListItem
                key={i}
                title={item.ItemName}
                subtitle={item.Reason}
                titleStyle={{ color: 'black', fontWeight: 'bold' }}
                rightElement={
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      this.props.navigation.navigate('ReceiverDetails', {
                        details: item,
                      });
                    }}>
                    <Text style={{ color: '#ffff' }}>Exchange</Text>
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
    height: RFValue(30),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
    borderRadius: RFValue(30),
  },
});