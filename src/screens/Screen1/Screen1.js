import React from "react";
import { Button, Image, Text, View, TouchableOpacity } from "react-native";

import { useNavigation } from "@react-navigation/native";

const Screen1 = () => {
  const navigation = useNavigation();

  return (
    <View style={{ backgroundColor: "#222D36", flex: 1 }}>
      <View style={{ marginTop: 100 }}>
        <Text style={{ color: "#fff", fontSize: 30, textAlign: "center" }}>Welcome to Whatsapp</Text>
      </View>

      <View style={{ alignItems: "center", marginTop: 100 }}>
        <Image source={require("../../assets/imageUI/logos_whatsapp.png")} style={{ width: 100, height: 100 }} />
      </View>
      <View style={{ alignItems: "center", flex: 1, justifyContent: "flex-end" }}>
        <Text style={{ color: "#fff", lineHeight: 30 }}>Read our Privacy Policy. Tap "Agree and continue"</Text>
        <Text style={{ color: "#fff", lineHeight: 15 }}>accept the Terms of Service</Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#00E676",
            margin: 10,
            padding: 10,
            width: "80%",
            alignItems: "center",
            borderRadius: 5,
          }}
          onPress={() => {
            navigation.navigate("Login");
          }}

        >
          <Text>AGREE AND CONTINUE</Text>

        </TouchableOpacity>

      </View>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "flex-end", marginBottom: 100 }}>
        <Text style={{ color: "#fff", fontSize: 20 }}>from</Text>
        <Text style={{ color: "#3B5998", fontSize: 20 }}>Facebook</Text>
      </View>
    </View>
  );
};
export default Screen1;
