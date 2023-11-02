import React, { useState,useReducer } from 'react';
import { View, Text, TextInput, Button, StyleSheet ,Image} from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth'; 
const firebaseConfig = {
  apiKey: ,
  authDomain: ,
  databaseURL: ,
  projectId: ,
  storageBucket: ,
  messagingSenderId:,
  appId: ,
  measurementId: 
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}



export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      alert('Login successful!');
      navigation.navigate('HomeScreen');
    } catch (error) {
      console.error('Error while logging in: ', error);
      alert('Authentication failed. Please try again.');
    }
  };

   const handleSignup = () => {

         navigation.navigate('SignUpScreen');

  };
 
  return (
    <View style={styles.container}>
       <Text style={styles.title}>
        Welcome to
      </Text>
      <Text style={styles.title}>
        Split Mobile Expense
      </Text>
      <Text style={styles.subTitle}>
        A simple money split app for everyday use
      </Text>
      <Image source={require('./assets/icons/split.gif')}style={{ width: 200, height: 200 }} />
      <TextInput
        style={styles.input}
        placeholder="Email"
         placeholderTextColor= "#999999"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
         placeholderTextColor= "#999999"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
    
      <Button title="Login" onPress={handleLogin} 
       disabled={!email && !password}
      />
      <View style={styles.messgaeView}>
        <Text>Don't have an account?</Text>
        <Text style={styles.link} onPress={handleSignup}>Sign up</Text>     
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'white',
  },
  input: {
    width: '80%',
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingVertical: 5,
  },
  gif: {
    width: 100, 
    height: 100, 
  },

  title: {
    color: "#6495ED",
    fontSize: 24,
    fontWeight: 'bold',
  },
  subTitle: {
    color: '#999999',
    fontSize: 13,
    marginBottom: 20,
  },
  messgaeView:{
    flexDirection: 'row',
    marginTop: 10
  },
  link:{
    color: 'blue',
    marginBottom: 20, 
    marginStart: 5
  },
});
