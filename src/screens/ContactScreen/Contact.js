import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import database from "@react-native-firebase/database";

const Contact = ({ contact, OnPress }) => {
  const [datadb, setdatadb] = useState(null);
  let invite = false;


  const chatapp = () => {
    const contactno = contact.phoneNumbers[0].number.replace(/\D/g, "");
    for (let key in datadb) {
      const contactdb = datadb[key].phone.slice(3);
      // console.log(contactdb,contactno);
      if (contactdb === contactno) {
        invite = true;
      }
    }
  };
  useEffect(() => {
    database()
      .ref("/users")
      .on("value", snapshot => {
        setdatadb(snapshot.val());
        // console.log('User data: ', snapshot.val());
      });

  }, []);

    chatapp();



  const imageUrl = contact?.thumbnailPath;

  return (
    <TouchableOpacity style={styles.contactCon} onPress={() => {
      OnPress(contact);
    }}>
      <View style={styles.imgCon}>
        <View style={styles.placeholder}>
          {
            imageUrl === "" ? <Text style={styles.txt}>{contact?.givenName[0]}</Text> :
              <Image source={{ uri: imageUrl }} style={{ width: "100%", height: "100%" }} />
          }
        </View>
      </View>
      <View style={styles.contactDat}>
        <Text style={styles.name}>
          {contact?.givenName} {contact?.middleName && contact.middleName + " "}
          {contact?.familyName}
        </Text>
        <Text style={styles.phoneNumber}>
          {contact?.phoneNumbers[0]?.number}
        </Text>
      </View>
      <View style={styles.invite}>
        {!invite && <Text style={styles.invitetext}>INVITE</Text>}
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  contactCon: {
    flex: 1,
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#d9d9d9",
  },
  imgCon: {},
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
    flex: 1,
    justifyContent: "center",
    paddingLeft: 5,
  },
  txt: {
    fontSize: 18,
  },
  name: {
    fontSize: 16,
    color: "#fff",
  },
  invitetext: {
    fontSize: 16,
    color: "#00D789",
  },
  phoneNumber: {
    color: "#888",
  },
  invite: {
    alignSelf: "center",
    right: 20,
  },
});
export default Contact;
