import React, { useRef, useState } from "react";
import {Text, View, TouchableOpacity, TextInput } from "react-native";

import { useNavigation } from "@react-navigation/native";

import styles from "./styles";


const Screen2 = ({ route }) => {
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const ref6 = useRef(null);
  const navigation = useNavigation();
  const cno = route?.params?.cno;
  const confirm = route?.params?.confirm;
  console.log("cno", cno,confirm);

  const [code1, setCode1] = useState("");
  const [code2, setCode2] = useState("");
  const [code3, setCode3] = useState("");
  const [code4, setCode4] = useState("");
  const [code5, setCode5] = useState("");
  const [code6, setCode6] = useState("");


  const submitHandler =() => {
    const a= code1+code2+code3+code4+code5+code6

    try {
      console.log('111');
      confirm.confirm(a).then(userdata => {
        console.log(userdata.user.uid);
        console.log("Success");
        navigation.navigate("AddDetails", { cno: cno ,uid:userdata.user.uid})
      });
    } catch (error) {
      console.log("Invalid code.");
    }

  }

  return (
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
      <View style={{ marginTop: 60, alignItems: "center" }}>
        <Text style={{ fontSize: 20, color: "green" }}>Verify {cno}</Text>
      </View>
      <View style={{ marginTop: 20, alignItems: "center" }}>
        <Text style={{ fontSize: 16 }}>Waiting to automatically detect an SMS sent to</Text>


        <Text style={{ fontSize: 16, lineHeight: 30 }}>{cno}. Wrong number ?</Text>

      </View>
      <View style={{ alignItems: "center" }}>
        <View style={{ flexDirection: "row", marginHorizontal: 10 }}>
          <TextInput
            style={styles.input}
            value={code1}
            maxLength={1}
            keyboardType="numeric"
            ref={ref1}
            onChangeText={text => {
              if (text === "") {
                ref1.current.focus();
                setCode1(text);
              } else {
                setCode1(text);
                ref2.current.focus();
              }
            }}
            placeholderTextColor="#aaaaaa"
          />
          <TextInput
            style={styles.input}
            value={code2}
            maxLength={1}
            ref={ref2}
            keyboardType="numeric"
            onChangeText={text => {
              setCode2(text);
              if (text === "") {
                ref1.current.focus();
              } else {
                ref3.current.focus();
              }
            }}
            placeholderTextColor="#aaaaaa"
          />
          <TextInput
            style={styles.input}
            value={code3}
            maxLength={1}
            ref={ref3}
            keyboardType="numeric"
            onChangeText={text => {
              setCode3(text);
              if (text === "") {
                ref2.current.focus();
              } else {
                ref4.current.focus();
              }
            }}
            placeholderTextColor="#aaaaaa"
          />
          <TextInput
            style={styles.input}
            value={code4}
            maxLength={1}
            ref={ref4}
            keyboardType="numeric"
            onChangeText={text => {
              setCode4(text);
              if (text === "") {
                ref3.current.focus();
              } else {
                ref5.current.focus();
              }
            }}
            placeholderTextColor="#aaaaaa"
          />
          <TextInput
            style={styles.input}
            value={code5}
            maxLength={1}
            ref={ref5}
            keyboardType="numeric"
            onChangeText={text => {
              setCode5(text);
              if (text === "") {
                ref4.current.focus();
              } else {
                ref6.current.focus();
              }
            }}
            placeholderTextColor="#aaaaaa"
          />
          <TextInput
            style={styles.input}
            value={code6}
            maxLength={1}
            ref={ref6}
            keyboardType="numeric"
            onChangeText={text => {
              setCode6(text);
              if (text === "") {
                ref5.current.focus();
              }

            }}
            placeholderTextColor="#aaaaaa"
          />
        </View>
        <Text>Enter Your OTP</Text>

      </View>
      {/*<Button title="Confirm Code" onPress={() => confirmCode()} />*/}
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity style={{
          marginTop: 100,
          alignItems: "center",
          borderRadius: 5,
          width: "30%",
          backgroundColor: "green",
          padding: 10,
        }}
                          onPress={submitHandler}

        >
          <Text style={{ color: "#fff" }}>Confirm Code</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default Screen2;
