import React, { useState, useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import styles from "./ExpenseScreenStyle";
import { getFilteredExpenses } from "../Reusable features/DateRangeFilter";
import { searchExpenses as filterBySearch} from "../Reusable features/SearchExpenses";
import { TextInput } from "react-native-gesture-handler";

type Expense = {
  id: string;
  description: string;
  amount: number;
  createdAt: string;
  exchangeRate: number;
  currencyCode: string;
};

const ExpenseScreen = () => {
  const [filter, setFilter] = useState("This week");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "1",
      description: "Sample Expense",
      amount: 100,
      createdAt: new Date().toISOString(),
      exchangeRate: 1,
      currencyCode: "USD",
    },
  ]);

  const filteredExpenses = getFilteredExpenses(
    expenses,
    filter,
    customStartDate,
    customEndDate
  );
  const searchExpenses = filterBySearch(filteredExpenses, searchQuery);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Expenses</Text>
      <TextInput
        placeholder="Search expenses..."
        style={styles.input}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View style={styles.filterRow}>
      {["This week", "Last Week", "This month", "Last month", "This Year", "Last Year", "Custom"].map((option) => (
      <Text
        key={option}
        onPress={() => setFilter(option)}
        style={[
          styles.filterOption,
          filter === option && styles.activeFilter,
        ]}
    >
      {option}
    </Text>
    
  ))}
</View>

      <FlatList
        data={searchExpenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const date = new Date(item.createdAt).toLocaleDateString();
          const converted = item.amount * item.exchangeRate;

          return (
            <View style={styles.item}>
              <View>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.meta}>{date}</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.amount}>
                  {item.currencyCode} {converted.toFixed(2)}
                </Text>
                <Text style={styles.meta}>
                  @{item.exchangeRate.toFixed(2)}
                </Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default ExpenseScreen;
