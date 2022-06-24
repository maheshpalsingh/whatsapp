import React from "react";
import {
  View, Text,
  SafeAreaView, StatusBar,
} from "react-native";


import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ChatHomeScreen from "../Authorized/ChatHomeScreen/ChatHomeScreen";
import { Screen1 } from "../index";
import StatusScreen from "../Authorized/StatusScreen/StatusScreen";
import Test from "../Authorized/Test/Test";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from 'react-native-vector-icons/Ionicons'
const Tab = createMaterialTopTabNavigator();

export default function HomeScreen(props) {
  const top = useSafeAreaInsets().top;
  return (
    <>

      <View style={{ backgroundColor: "#222D36", padding: 20, paddingTop: top+5 }}>
        <Text style={{ color: "#ADACAC", fontSize: 20, fontWeight: "bold" }}>Whatsapp </Text>

      </View>


      {/*// <SafeAreaView style={{flex:1}}>*/}
      <Tab.Navigator
        initialRouteName="Chat"
        screenOptions={{
          tabBarInactiveTintColor: "#ADACAC",
          tabBarActiveTintColor: "#00D789",
          tabBarLabelStyle: { fontSize: 14 },
          tabBarStyle: { backgroundColor: "#222D36" },
          tabBarIndicatorStyle:{backgroundColor: "#00D789"}

        }}
      >
        <Tab.Screen
          name="Feed"
          component={Test}
          options={{ tabBarLabel: "Camera" }}
        />
        <Tab.Screen
          name="Chat"
          component={ChatHomeScreen}
          options={{ tabBarLabel: "CHAT" }}
        />
        <Tab.Screen
          name="Profile"
          component={StatusScreen}
          options={{ tabBarLabel: "Status" }}
        />
      </Tab.Navigator>
    </>
  );
}


