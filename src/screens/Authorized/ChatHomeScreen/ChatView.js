import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";

const ChatView = ({ contact, onPress, userstatus, lastseen, mess }) => {


  const imageUrl = contact?.image;
  return (
    <TouchableOpacity style={styles.contactCon} onPress={onPress}>
      <View style={styles.placeholder}>
        {
          imageUrl === "" ? <Text style={styles.txt}>{contact?.givenName[0]}</Text> :
            <Image source={{ uri: imageUrl }} style={{ width: "100%", height: "100%" }} />
        }
      </View>
      <View style={styles.contactDat}>
        <Text style={styles.name}>
          {contact?.name}

        </Text>
        <View style={{ flexDirection: "row" }}>
          <Icon name="checkmark-done-outline" size={20} style={{ paddingLeft: 5, paddingTop: 5 }}
                color={mess?.seen ? "#3AB0FF" : "grey"} />
          <Text style={{ paddingLeft: 5, paddingTop: 5, color: "#fff" }}>{mess.text}</Text>
        </View>


      </View>
      <View style={styles.activestatus}>

        <Text style={{
          paddingTop: 5,
          color: "#fff",
        }}>

          {moment(mess?.time?.toDate()).format("hh:mm a")}
        </Text>
        {/*{userstatus ?<Text style={{color:'#fff'}}>Online</Text>:<Text style={{color:'#fff'}}>{lastseen?.slice(15,21)}</Text>}*/}
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  contactCon: {
    flex: 1,
    flexDirection: "row",
    padding: 15,
    // backgroundColor: 'red',
    borderBottomWidth: 0.5,
    // borderBottomColor: '#d9d9d9',
  },

  placeholder: {

    width: 55,
    height: 55,
    borderRadius: 30,
    overflow: "hidden",
    backgroundColor: "#d9d9d9",
    alignItems: "center",
    justifyContent: "center",
  },
  contactDat: {
    flex: 3,
    paddingLeft: 15,
    paddingTop: 10,
  },
  txt: {
    fontSize: 18,

  },
  name: {

    color: "#fff",
    fontSize: 18,

  },
  phoneNumber: {
    color: "#888",
  },
  activestatus: {
    flex: 1,
    width: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
});
export default ChatView;
