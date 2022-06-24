import React,{useState} from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";


const SelectImage=({route})=>{
  const image=route?.params?.image
  const [message, setMessage] = useState([]);

  return(
    <View style={{flex:1}}>
      <Image source={{uri:image}} style={StyleSheet.absoluteFillObject} />
      <View style={styles.footer}>
        <View style={{ flex: 1 }}>
          <TextInput
            placeholder="Message"
            placeholderTextColor="grey"
            value={message}
            onChangeText={(t) => setMessage(t)}
            style={styles.input} />
        </View>
        <TouchableOpacity style={styles.send}>
          <Icon name="send-outline" size={27} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  footer: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: 10,
    width: "80%",
    position:'absolute',
    height: 60,
    //marginBottom:10,
     marginTop: 800,
    borderRadius: 40,
    backgroundColor: "#222D36",
  },
  input: {
    color: "#fff",
    fontSize: 20,
    width: "120%",
    height: "100%",
    // position: "absolute",
    //backgroundColor: "red",

  },
  send: {
    marginTop: 2,
    justifyContent: "center",
    alignItems: "center",
    width: "16%",
    height: "90%",
    backgroundColor: "#00D789",
    left: 60,
    borderRadius: 30,
  },
})

export default SelectImage
