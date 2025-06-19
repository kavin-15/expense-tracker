import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import HomeScreen from "../screens/HomeScreen";
import AboutScreen from "../screens/AboutScreen";
import { Ionicons } from "@expo/vector-icons";
import ExpenseScreen from "../screens/ExpenseScreen";
import ReportsScreen from "../screens/ReportsScreen";
import SettingsScreen from "../screens/SettingsScreen";
const Tab = createMaterialTopTabNavigator();
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator 
        initialRouteName="Home"
        screenOptions={({ route }) => ({
            tabBarLabelStyle: { fontSize: 12 },
            tabBarIndicatorStyle: { backgroundColor: '#2e86de' },
            tabBarIcon: ({ color }) => {
              let iconName: keyof typeof Ionicons.glyphMap = "home";

             if (route.name === 'Home') iconName = 'home';
                else if (route.name === 'Expense') iconName = 'cash-outline';
                else if (route.name === 'Reports') iconName = 'bar-chart';
                else if (route.name === 'Settings') iconName = 'settings';
                else if (route.name === 'About') iconName = 'information-circle';

              return <Ionicons name={iconName} size={20} color={color} />;
            },
            tabBarActiveTintColor: '#2e86de',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name ="Expense" component={ExpenseScreen} />
          <Tab.Screen name ="Reports" component={ReportsScreen} />
          <Tab.Screen name="About" component={AboutScreen} />
          <Tab.Screen name ="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  };
  export default AppNavigator;