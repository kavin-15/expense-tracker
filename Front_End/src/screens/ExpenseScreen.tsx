import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ExpenseScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expense Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
   },
  title: {
    fontSize: 18,
    color: "#333",
  },
});

export default ExpenseScreen;
