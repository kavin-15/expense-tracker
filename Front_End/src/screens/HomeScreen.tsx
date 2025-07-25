import React, { useEffect, useState } from 'react';
import {View,Text,TouchableOpacity,Modal,TextInput,Alert,FlatList,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
// import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './HomeScreenStyle';
import { filterOptions, getFilteredExpenses } from '../Reusable features/DateRangeFilter';

type Expense = {
  createdAt: string;
  expenseID: string;
  description: string;
  amount: number;
  exchangeRate: number;
  currencyCode: string;
};

const HomeScreen = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [filter, setFilter] = useState('This week');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [currencyCode, setCurrencyCode] = useState('USD'); // Default currency code
  const [exchangeRate, setExchangeRate] = useState<number | null>(null); // Exchange rate for the currency
  const [expenseDate, setExpenseDate] = useState(new Date());
  const [selectExpenseCurrency, setSelectedExpenseCurrency] = useState(currencyCode);
  const currencyOptions = [
    { code: 'USD', label: 'US Dollar' },
    { code: 'EUR', label: 'Euro' },
    { code: 'GBP', label: 'British Pound' },
    { code: 'INR', label: 'Indian Rupee' },
    { code: 'JPY', label: 'Japanese Yen' },
    { code: 'AUD', label: 'Australian Dollar' },
    { code: 'CAD', label: 'Canadian Dollar' },
    { code: 'CNY', label: 'Chinese Yuan' },
  ];
  const fetchExpensesFromAWS = async () => {
    try {
      const res = await fetch("https://u1t9aq8uia.execute-api.us-west-1.amazonaws.com/Prod/getExpense");
      const data = await res.json();
      console.log("Fetched from AWS:", data);
      setExpenses(data);  // Update state with fetched data
    } catch (error) {
      console.error("Error fetching expenses from AWS:", error);
      Alert.alert("Error", "Failed to fetch expenses");
    }
  };

  useEffect(() => {
  fetchExpensesFromAWS();
}, []);


  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleAddExpense = async () => {
      if (!description || !amount) {
        Alert.alert('Oops!', 'You forgot to add a description or amount.');
        return;
      }
      const expense ={
        expenseID: Date.now().toString(),
        description: description,
        amount: parseFloat(amount),
        createdAt: new Date().toISOString(),
        exchangeRate: 1,
        currencyCode: "USD"
      };

      try{
        console.log("Sending data to AWS:", expense);
        const response = await fetch(
          "https://u1t9aq8uia.execute-api.us-west-1.amazonaws.com/Prod/expense",
          {
            method: "POST",
            headers:{
              "Content-Type":"application/json"
            },
            body: JSON.stringify(expense)
          }
        );

        const data = await response.json();
        console.log("AWS Response", data);

        if(response.ok){
          Alert.alert("Success, Expense added!");
          console.log(data);

          await fetchExpensesFromAWS();
          setModalVisible(false);
          setDescription('');
          setAmount('');
        }else{
          console.error("Error:", data);
          Alert.alert("Error, Please try again.")
        }
      }catch (error){
        console.error("Error:", error);
        Alert.alert("Error, Failed to connect to server, Please try again");
      }
      // const createdAt = new Date();
      // const dateStr = createdAt.toISOString().split('T')[0];
      // const res = await fetch(`https://api.exchangerate.host/latest?base=USD&symbols=${currencyCode}`);
      // const data = await res.json();
      // const rate = data.rates[currencyCode];
  
      // const newExpense: Expense = {
      //   id: Date.now().toString(),
      //   description,
      //   amount: parseFloat(amount),
      //   createdAt: new Date().toISOString(),
      //   exchangeRate: rate,
      //   currencyCode: currencyCode,
      // };
  
      // setExpenses((prev) => [newExpense, ...prev]);
      // setModalVisible(false);
      // setDescription('');
      // setAmount('');
    };

  const filteredExpenses = getFilteredExpenses(
  expenses,
  filter,
  customStartDate,
  customEndDate
);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Expense Tracker!</Text>
      <View style={styles.row}>
        <TouchableOpacity style={styles.card} onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle-outline" size={24} color="#333" />
          <Text style={styles.cardText}>Add Expense</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Ionicons name="wallet-outline" size={24} color="#333" />
          <Text style={styles.cardText}>Total: {totalExpense.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <Picker
            selectedValue={currencyCode}
            style={{ flex: 1 }}
            onValueChange={(itemValue) => setCurrencyCode(itemValue)}
        >
            {currencyOptions.map((currency) => (
                <Picker.Item key={currency.code} label={currency.label} value={currency.code} />
            ))}
        </Picker>
        </View>

    {exchangeRate && (
        <Text style={{ fontStyle: 'italic', color: '#777', marginBottom: 8 }}>
            ₹1 = {exchangeRate.toFixed(4)} {currencyCode} (Latest)
        </Text>
    )}
    {/* {USDRate(
        <View style={styles.rateBox}>
            <Ionicons name="swap-horizontal-outline" size={24} color="#333" style={{ marginRight: 6 }} />
            <Text style={styles.rateText}>1 USD = {USDRate.toFixed(2)}{currencyCode}</Text>
        </View>
    )} */}

    <Text style={styles.sectionTitle}>Recent Expenses</Text>
    <FlatList
        data={filteredExpenses.slice(0,10)}
        keyExtractor={(item) => item.expenseID}
        renderItem={({ item }) => {
            const date = new Date(item.createdAt);
            const converted = item.amount * item.exchangeRate;
            return (
                <View style={styles.transaction}>
                    <View>
                        <Text style={styles.transactionText}>{item.description}</Text>
                        <Text style={styles.subText}>
                            ₹{item.amount.toFixed(2)} on {date.toDateString()}
                        </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.transactionAmount}>
                            {item.currencyCode} {converted.toFixed(2)}
                        </Text>
                        <Text style={styles.subText}>
                            @ ₹{item.exchangeRate.toFixed(2)} per {item.currencyCode}
                        </Text>
                    </View>
                </View>
            );
        }}
    />
    <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>Filter by:</Text>
        {filterOptions.map((option) => (
            <TouchableOpacity key={option} onPress={() => setFilter(option)}>
                <Text style={[styles.filterOption, filter === option && styles.activeFilter]}>
                    {option}
                </Text>
            </TouchableOpacity>
        ))}
    </View>
    <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Add New Expense</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Description"
                    value={description}
                    onChangeText={setDescription}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Amount"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                />
                <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
                    <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
    </View>
  );
};

export default HomeScreen;
