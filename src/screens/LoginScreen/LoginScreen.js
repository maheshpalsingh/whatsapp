import React, { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import "@react-native-firebase/app";
import auth from "@react-native-firebase/auth";


export default function LoginScreen({ navigation }) {

  const [confirm, setConfirm] = useState(null);
  const [cno, setcno] = useState("");

  const signInWithPhoneNumber=(phoneNumber)=> {
    console.log('otp',confirm);
    auth().signInWithPhoneNumber(phoneNumber)
      .then((res)=>{
        console.log('Auth',res);
        setConfirm(res);
       navigation.navigate("Screen2", { cno: cno,confirm:res })
    }).catch((e)=>console.log('Errorr',e))
  }

  return (
      <View>
        <View style={{ marginTop: 100, alignItems: "center" }}>
          <Text style={{ color: "#83BD75", fontSize: 20 }}>Enter your phone number</Text>
          <Text style={{ marginTop: 20, fontSize: 16 }}>Whatsapp will send an SMS message to verify your</Text>
          <Text style={{ fontSize: 16 }}>phone number. What's my number ?</Text>
        </View>
        <TextInput
          style={{
            width: "90%",
            backgroundColor: "white",
            marginTop: 100,
            marginBottom: 10,
            marginLeft: 30,
            marginRight: 30,
            paddingLeft: 16,
            height: 48,
            borderRadius: 5,
            overflow: "hidden",
          }}
          value={cno}
          //keyboardType="numeric"
          onChangeText={c => setcno(c)}
          placeholder="Phone no."
          placeholderTextColor="#aaaaaa"
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <Text style={{ alignItems: "center", paddingLeft: 100, color: "grey" }}>Carrier SMS charges may apply</Text>
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity style={{
            marginTop: 100,
            alignItems: "center",
            borderRadius: 5,
            width: "20%",
            backgroundColor: "green",
            padding: 10,
          }}
            onPress={() => signInWithPhoneNumber(cno)}>
            <Text style={{ color: "#fff" }}>NEXT</Text>
          </TouchableOpacity>
        </View>
      </View>

  );
}
