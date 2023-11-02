import React, { useState, useEffect } from 'react';
import {Modal, StyleSheet,Text,View,TextInput,Image,Button,ScrollView,FlatList,TouchableOpacity,} from 'react-native';
import logoutButton from './assets/icons/logout.png'; 
import { useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

export default function HomeScreen({ navigation }) {
  const [isModalVisible, setIsModalVisible] = useState(false);  
  const [selectedBillImage, setSelectedBillImage] = useState(null);
  const [billImage, setBillImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [amountDue, setAmountDue] = useState({});
  const [payer, setPayer] = useState('');
  const [splitWith, setSplitWith] = useState('');
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [isSortButtonDisabled, setIsSortButtonDisabled] = useState(true);
  const [sortAsc, setSortAsc] = useState(true);
  const route = useRoute();
  const selectedFriend = route.params?.selectedFriend;

  const openModal = (imageUri) => {
  setSelectedBillImage(imageUri);
  setIsModalVisible(true);
  };

  const addExpense = () => {
    if (description && amount && payer && splitWith) {
      const newExpense = {
        id: expenses.length.toString(),
        description,
        amount: parseFloat(amount),
        payer,
        splitWith: splitWith.split(',').map((friend) => friend.trim()),
        date: new Date(),
        billImage,
      };
      setExpenses([...expenses, newExpense]);
      setDescription('');
      setAmount('');
      setPayer('');
      setSplitWith('');
      setBillImage(null);
      setTotalExpenses(totalExpenses + newExpense.amount);
      setIsSortButtonDisabled(false);
     
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setBillImage(result.uri);
    }
  };

  useEffect(() => {
    const amounts = {};

    expenses.forEach((expense) => {
      const splitAmount = expense.amount / (expense.splitWith.length + 1);
      amounts[expense.payer] = (amounts[expense.payer] || 0) + expense.amount - splitAmount;

      expense.splitWith.forEach((person) => {
        amounts[person] = (amounts[person] || 0) - splitAmount;
      });
    });

    setAmountDue(amounts);
  }, [expenses]);
const clearInputFields = () => {
    setDescription('');
    setAmount('');
    setPayer('');
    setSplitWith('');
    setselectedFriend('');
  };

  const shareExpense = (expense) => {
    const expenseDetails = `Expense Details: \nDescription: ${expense.description}\nAmount: $${expense.amount.toFixed(2)}\nPaid by: ${expense.payer}\nSplit with: ${expense.splitWith.join(', ')}\nDate: ${expense.date.toLocaleDateString()}`;

    if (navigator.share) {
      navigator
        .share({ title: 'Share Expense', text: expenseDetails })
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.error('Share failed:', error));
    } else {
      alert(`Expenses shared`);
    }
  };

  const logout = () => {
    navigation.navigate('LoginScreen');
  };

  const viewFriendList = () => {
    navigation.navigate('ViewFriendList');
  };

  const deleteExpense = (id) => {
    const deletedExpense = expenses.find((expense) => expense.id === id);
    if (deletedExpense) {
      setExpenses(expenses.filter((expense) => expense.id !== id));
      setTotalExpenses(totalExpenses - deletedExpense.amount);
    }
    if (expenses.length === 0) {
      setIsSortButtonDisabled(true);
    }
  };

  const sortExpenses = () => {
    const sortedExpenses = expenses.slice().sort((a, b) => {
      if (sortAsc) {
        return a.date - b.date;
      } else {
        return b.date - a.date;
      }
    });
    setExpenses(sortedExpenses);
    setSortAsc(!sortAsc);
  };

  const AmountsDue = ({ data }) => {
    if (Object.keys(data).length === 0) {
      return <Text style={styles.noDataText}>No Amounts Due Available</Text>;
    }

    return (
      <View style={styles.amountsDueContainer}>
        <Text style={styles.amountsDueHeader}>Amounts Due</Text>
        {Object.entries(data).map(([person, amount], index) => {
          const amountText = amount > 0
            ? `${person} is owed $${amount.toFixed(2)}`
            : `${person} owes $${Math.abs(amount).toFixed(2)}`;
          return (
            <Text key={index} style={styles.amountDueText}>{amountText}</Text>
          );
        })}
      </View>
    );
  };

  const filteredExpenses = expenses.filter(expense => {
    const expenseData = `${expense.description.toUpperCase()}   
                        ${expense.amount}   
                        ${expense.payer.toUpperCase()}   
                        ${expense.splitWith.join(' ').toUpperCase()}`;
    const searchData = searchQuery.toUpperCase();

    return expenseData.indexOf(searchData) > -1;
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
       <TouchableOpacity
        onPress={logout}
        style={styles.logoutButtonContainer} 
      >
        <Image source={require('./assets/icons/logout.png')} style={styles.logoutButton} />
      </TouchableOpacity>
      <Button title='View Friend List ' onPress={viewFriendList} />
     
        <Image
          source={require('./assets/icons/split.jpeg') }
          style={styles.headerImage}
        />
     
       <View style={styles.space}/>
      <View style={styles.inputContainer}>

        <Button title="Pick an image from camera roll" onPress={pickImage} />
        {billImage && <Image source={{ uri: billImage }} style={styles.billImage} />}

        <TextInput
          style={styles.input}
          placeholder='Description'
          placeholderTextColor= "#999999"
          onChangeText={(text) => setDescription(text)}
          value={description}
        />
        <TextInput
          style={styles.input}
          placeholder='Amount'
          placeholderTextColor= "#999999"
          onChangeText={(text) => 
           setAmount(text.replace(/[^0-9.]/g, ''))}
          value={amount}
         
        />
        <TextInput
          style={styles.input}
          placeholder='Payer'
          placeholderTextColor= "#999999"
         onChangeText={(text) => setPayer(text)}
          value={selectedFriend || payer  }
/>
        <TextInput
          style={styles.input}
          placeholder='Split With (comma separated)'
          placeholderTextColor= "#999999"
          onChangeText={(text) => setSplitWith(text)}
          value={splitWith}
        />
        <Button title="Clear" onPress={clearInputFields}
        disabled={!description && !amount && !payer && !splitWith && !selectedFriend}
         />
        
         <View style={styles.space}/>
        <Button title='Add Expense' onPress={addExpense} />
      </View>

      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          placeholderTextColor="#999999"
          onChangeText={text => setSearchQuery(text)}
          value={searchQuery}
        />
      </View>

      <AmountsDue data={amountDue} />

      <View style={styles.expenseListContainer}>
        <Text style={styles.expenseListHeader}>Earlier Added Expenses</Text>
        <Button
          title={`Sort by Date ${sortAsc ? 'Asc' : 'Desc'}`}
          onPress={sortExpenses}
          disabled={isSortButtonDisabled}
        />
        <FlatList
          style={styles.expenseList}
          data={filteredExpenses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.expenseItem}>
              <Text>Description: {item.description}</Text>
              <Text>Amount: ${item.amount.toFixed(2)}</Text>
              <Text>Paid by: {item.payer}</Text>
              <Text>Split with: {item.splitWith.join(', ')}</Text>
              <Text>Date: {item.date.toLocaleDateString()}</Text>
              {item.billImage && (
                <TouchableOpacity onPress={() => openModal(item.billImage)}>
                  <Image source={{ uri: item.billImage }} style={styles.billImage} />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.shareButton}
                onPress={() => shareExpense(item)}
              >
                <Text style={styles.shareButtonText}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteExpense(item.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
              
            </View>
          )}
        />
        <Text style={styles.totalExpenses}>
          Total Expenses: ${totalExpenses.toFixed(2)}
        </Text>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(!isModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {selectedBillImage && (
              <Image source={{ uri: selectedBillImage }} style={styles.modalImage} />
            )}
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setIsModalVisible(!isModalVisible)}
            >
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 20,
  },
  headerImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    alignItems: 'center',
  },
  inputContainer: {
    width: '90%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  expenseListContainer: {
    width: '90%',
  },
  expenseListHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  expenseItem: {
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingVertical: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
  },
  totalExpenses: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  shareButton: {
    backgroundColor: 'green',
    padding: 5,
    borderRadius: 5,
     width: '100%', 
    marginTop: 5,
    alignItems: 'center',
  },
  shareButtonText: {
    color: 'white',
  },
 logoutButtonContainer: {
    position: 'absolute', 
    top: 30,
    right: 20
  },
  
  logoutButton: {
    width: 50,
    height: 50,
  },
     space: {
    width: 20, 
    height: 20, 
  },
  amountsDueContainer: {
    marginVertical: 20,
    width: '90%',
  },
  amountsDueHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  amountDueText: {
    fontSize: 16,
    marginBottom: 5,
  },
  searchBarContainer: {
    width: '90%',
    marginBottom: 20,
  },
  searchBar: {
    width: '100%',
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
  },
  billImage: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalImage: {
    width: 300,
    height: 300,
    marginBottom: 15,
  },
});
