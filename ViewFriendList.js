import React, { useState } from 'react';
import { View, Text, TextInput, Button,FlatList,TouchableOpacity, StyleSheet ,Image} from 'react-native';
import backButton from './assets/icons/back.jpg'; 


export default function viewFriendList({ navigation }) {
 
  const [friends, setFriends] = useState([
    { id: '1', name: 'Tom' },
    { id: '2', name: 'Krunal' },
    { id: '3', name: 'Surekha' },
  ]);
const [newFriendName, setNewFriendName] = useState('');


const setPayerCallback = (friendName) => {
 navigation.navigate('HomeScreen', { selectedFriend: friendName });
};
const back = () => {
    navigation.navigate('HomeScreen');
  };
  const addFriend = () => {
    if (newFriendName) {
      const newFriend = {
        id: (friends.length + 1).toString(),
        name: newFriendName,
      };
      setFriends([...friends, newFriend]);
      setNewFriendName('');
     alert('New Friend added successfully');
    }
  };

  return (
    <View style={styles.container}>
    <TouchableOpacity
        onPress={back}
        style={styles.backButtonContainer} 
      >
      <Image source={require('./assets/icons/back.jpg')} style={styles.backButton} />
      </TouchableOpacity>
      <Text style={styles.title}>Friend List</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Friend's Name"
         placeholderTextColor= "#999999"
        onChangeText={setNewFriendName}
        value={newFriendName}
      />

      <View style={styles.space}/>
      <Button title="Add Friend" onPress={addFriend}
       disabled={!newFriendName}
       />

       <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.friendItem}
            onPress={() => setPayerCallback(item.name)} 
          >
            <Text style={styles.friendName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
 container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'white'
  },
 title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 50
  },
   input: {
    width: '80%',
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingVertical: 5,
  },
  friendItem: {
    borderBottomWidth: 1,
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
  },
  friendName: {
    fontSize: 18,
  },
  space:{
    width: 20, 
    height: 20, 
  },
  backButtonContainer: {
    position: 'absolute', 
    top: 30,
    right: 20
  },
  
  backButton: {
    width: 50,
    height: 50,
  },
});
