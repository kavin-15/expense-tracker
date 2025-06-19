import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
// import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './HomeScreenStyle';

type Expense = {
  createdAt: string;
  id: string;
  description: string;
  amount: number;
  exchangeRate: number;
  currencyCode: string;
};

const filterOptions = [
  'This week',
  'Last Week',
  'This month',
  'Last month',
  'This Year',
  'Last Year',
  'Custom',
];

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
  useEffect(() => {
    fetchLatestRates();
  }, [currencyCode]);
    const [USDRate, setUSDRate] = useState<number | null>(null);

    console.log("USDRate:", USDRate);
    
    const fetchUSDRate = async () => {
    try {
        const res = await fetch(`https://api.exchangerate.host/latest?base=USD&symbols=${currencyCode}`);
        const data = await res.json();
        setUSDRate(data.rates[currencyCode]);
    } catch (error) {
        console.error('Error fetching USD rate:', error);
    }
    };
  useEffect(() => {
    fetchUSDRate();
  }, [currencyCode]);
  const fetchLatestRates = async () => {
    try{
        const res = await fetch(`https://api.exchangerate.host/latest?base=USD&symbols=${currencyCode}`);
        const data = await res.json();
        setExchangeRate(data.rates[currencyCode]);
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
    }
  };

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleAddExpense = async () => {
      if (!description || !amount) {
        Alert.alert('Oops!', 'You forgot to add a description or amount.');
        return;
      }
      const createdAt = new Date();
      const dateStr = createdAt.toISOString().split('T')[0];
      const res = await fetch(`https://api.exchangerate.host/latest?base=USD&symbols=${currencyCode}`);
      const data = await res.json();
      const rate = data.rates[currencyCode];
  
      const newExpense: Expense = {
        id: Date.now().toString(),
        description,
        amount: parseFloat(amount),
        createdAt: new Date().toISOString(),
        exchangeRate: rate,
        currencyCode: currencyCode,
      };
  
      setExpenses((prev) => [newExpense, ...prev]);
      setModalVisible(false);
      setDescription('');
      setAmount('');
    };

  const getFilteredExpenses = () => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (filter) {
      case 'This week': {
        const day = now.getDay();
        startDate = new Date(now);
        startDate.setDate(now.getDate() - day);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        break;
      }
      case 'Last Week': {
        const day = now.getDay();
        endDate = new Date(now);
        endDate.setDate(now.getDate() - day - 1);
        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 6);
        break;
      }
      case 'This month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case 'Last month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case 'This Year':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        break;
      case 'Last Year':
        startDate = new Date(now.getFullYear() - 1, 0, 1);
        endDate = new Date(now.getFullYear() - 1, 11, 31);
        break;
      case 'Custom':
        if (!customStartDate || !customEndDate) return [];
        startDate = new Date(customStartDate);
        endDate = new Date(customEndDate);
        break;
      default:
        return expenses;
    }

    return expenses
      .filter((e) => {
        const createdAt = new Date(e.createdAt);
        return createdAt >= startDate && createdAt <= endDate;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

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
        data={expenses}
        keyExtractor={(item) => item.id}
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
