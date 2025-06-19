import React, { useState } from "react";
import { View, Text, FlatList } from "react-native";
import styles from "./ExpenseScreenStyle";

type Expense = {
  id: string;
  description: string;
  amount: number;
  createdAt: string;
  exchangeRate: number;
  currencyCode: string;
};

const ExpenseScreen = () => {
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Expenses</Text>
      <FlatList
        data={expenses}
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
