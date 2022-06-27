import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, Image, FlatList, AppState, StatusBar } from "react-native";
import Icons from "react-native-vector-icons/Ionicons";

import ChatView from "./ChatView";
import database from "@react-native-firebase/database";
import firestore from "@react-native-firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import storage, { firebase } from "@react-native-firebase/storage";
import { setToken } from "../../../store/actions/users";

const ChatHomeScreen = ({ navigation }) => {

  const [users, setUsers] = useState([]);
  const tmpUsers = useRef([]);
  const [channelID, setChannelID] = useState();
  const [userStatus, setStatus] = useState(false);
  const [userLastSeen, setLastSeen] = useState(false);
  const [lastmessage, setLastMessage] = useState([]);
  const [myFCM, setFCM] = useState();
  const uid = useSelector(state => state.user.token);

//fcm token
  useEffect(() => {

    firestore()
      .collection("Users")
      .doc(uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          firebase
            .messaging()
            .getToken(firebase.app().options.messagingSenderId)
            .then(x => {
              // console.log(x)
              if (documentSnapshot.data().fcm ) {
                let check=documentSnapshot.data().fcm.includes(x)
                  if(!check)
                  {
                    if(documentSnapshot.data().fcm.length===3)
                    {
                      let final= documentSnapshot.data().fcm.slice(-2).concat(x)
                      firestore()
                        .collection("Users")
                        .doc(uid)
                        .set({ fcm: final}, { merge: true })
                        .then(() => {});
                    }
                  else {
                      let final= documentSnapshot.data().fcm.concat(x)
                      firestore()
                        .collection("Users")
                        .doc(uid)
                        .set({ fcm: final}, { merge: true })
                        .then(() => {});
                    }
                  }

              } else {
                console.log("setting fcm");
                  firestore()
                    .collection("Users")
                    .doc(uid)
                    .set({ fcm: [x] }, { merge: true })
                    .then(() => {});
              }
            })
            .catch(e => console.log(e));
        }

      });

  }, [uid]);

//app state
  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      const reference = database().ref(`/online/${uid}`);
      if (nextAppState === "active") {
        //console.log("online");
        reference
          .update({
            isActive: true,
          })
          .then(() => console.log("active"));
      } else {
        //console.log("offline");
        reference
          .update({
            isActive: false,
            lastSeen: Date(),
          })
          .then(() => console.log("inactive"));
      }
      reference.onDisconnect().update({
        isActive: false,
        lastSeen: Date(),
      }).then(() => console.log("On disconnect function configured."));
    });
    return () => {
      subscription.remove();
    };
  }, [uid]);


  // useEffect(() => {
  //   // database()
  //   //   .ref(`/users`)
  //   //   .once('value')
  //   //   .then(snapshot => {
  //   //     // console.log('User data: ', snapshot.val());
  //   //     setUsers(snapshot.val())
  //   //   });
  //   firestore()
  //     .collection('Users')
  //     .get()
  //     .then(querySnapshot => {
  //     //  console.log('Total users: ', querySnapshot.size);
  //
  //       querySnapshot.forEach(documentSnapshot => {
  //         // console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
  //       });
  //     });
  //   }, []);


  useEffect(() => {
    firestore()
      .collection("Channels")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot.id.includes(uid)) {
            setChannelID(documentSnapshot.id);

            firestore()
              .collection("Channels")
              .doc(documentSnapshot.id)
              .collection("messages")
              .orderBy("time", "desc")
              .limit(1)
              .onSnapshot(snapshot => snapshot.docChanges().forEach(
                change => {
                  setLastMessage(change.doc.data());
                },
              ));

            let otherUserId = documentSnapshot.id.replace(uid, "");
            firestore()
              .collection("Users")
              .doc(otherUserId)
              .get()
              .then(documentSnapshot => {
                if (documentSnapshot.exists) {
                  let image = otherUserId + ".jpg";
                  let obj = {};

                  obj.id = otherUserId;
                  obj.name = documentSnapshot.data().name;
                  obj.phone = documentSnapshot.data().phone;
                  storage()
                    .ref(image)
                    .getDownloadURL()
                    .then(res => {
                      obj.image = res;
                      tmpUsers.current.push(obj);
                      setUsers(tmpUsers.current);
                    })
                    .catch(e => {
                      console.log("error", e);
                    });

                  database()
                    .ref(`/online/${otherUserId}`)
                    .on("value", snapshot => {
                      //console.log('User data: ', snapshot.val());
                      setStatus(snapshot.val()?.isActive);
                      setLastSeen(snapshot.val()?.lastSeen);
                    });
                }
              });
          }
        });
      });

  }, []);


  const startConversation = () => {
    navigation.navigate("ContactScreen");
  };


  const keyExtractor = (item, idx) => {
    // console.log(item);
    return item?.recordID?.toString() || idx.toString();
  };
  const renderItem = ({ item, index }) => {

    return <ChatView contact={item} userstatus={userStatus} lastseen={userLastSeen} mess={lastmessage} onPress={() => {
      // navigation.navigate("ChatMainScreen", { item, channelID,userLastSeen,userStatus });
      navigation.navigate("ChatMainScreen", { item, channelID });
    }} />;
  };

  return (
    <View style={{ backgroundColor: "#101D24", flexGrow: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor='#101D24'  />
      {users.length !== 0 && <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        style={{ flex: 1 }}
      />}


      <View style={{ width: 80, height: 80, position: "absolute", bottom: 50, right: 30 }}>
        <TouchableOpacity style={{ flex:1, backgroundColor: "#00D789", height: "100%", borderRadius: 100,justifyContent:'center' }}
                          onPress={startConversation}
        >
          <Image source={require("../../../assets/imageUI/mdi_android-messages.png")}
                 style={{ alignSelf:'center' }} />
        </TouchableOpacity>
      </View>
    </View>);
};

export default ChatHomeScreen;
