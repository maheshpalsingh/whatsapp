import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Button,
  Dimensions,
  TouchableOpacity, ScrollView, SafeAreaView, FlatList, AppState, StatusBar, ImageBackground, Pressable, Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import firestore from "@react-native-firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from "react-native-image-picker";
import MessageView from "./MessageView";
import "@react-native-firebase/messaging";
import { useNavigation } from "@react-navigation/native";

import storage, { firebase } from "@react-native-firebase/storage";
import database from "@react-native-firebase/database";
import axios from "axios";
import * as messageActions from "../../../store/actions/messages";
import moment from "moment";
import { READ_MESSAGE } from "../../../store/actions/messages";

const ChatMainScreen = ({ route }) => {
  const navigation = useNavigation();
  const [userStatus, setStatus] = useState(false);
  const [userLastSeen, setLastSeen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const selectedID = useRef();
  const messageSenderID = useRef();
  const flatlistRef = useRef();
  const uid = useSelector(state => state.user.token);
  const items = route?.params?.item;
  const channelID = route?.params?.channelID;
  const otherUserId = channelID.replace(uid, "");
  //console.log(userLastSeen,userStatus,'2');
  // const [message, setMessage] = useState([]);
  const [newMessage, setnewMessage] = useState("");
  const getMessage = useSelector(state => state.message.messages[channelID]);

  const message = getMessage || [];
  //console.log("message",message);
  const dispatch = useDispatch();
  let imageUrl = items.image;

  const getAllMessages = async () => {
    await dispatch(messageActions.readAllMessages(channelID));
  };
  const lastVisible = message[0]?.created_at;
  const getNewMessage = async () => {
    dispatch(messageActions.readNewMessage(channelID, lastVisible));
  };

  useEffect(() => {
    if (message.length === 0) {
      console.log("initial");
      getAllMessages().then();
    } else {
      console.log("update");
      getNewMessage().then();
    }
  }, [channelID]);


  useEffect(() => {

    database()
      .ref(`/online/${items.id}`)
      .on("value", snapshot => {
        // console.log('1111User data: ', snapshot.val());
        setStatus(snapshot.val()?.isActive);
        setLastSeen(snapshot.val()?.lastSeen?.slice(0, 21));
      });

    // const subscriber = firestore()
    //   .collection("Channels")
    //   .doc(channelID)
    //   .collection("messages")
    //   .orderBy("time", "asc")
    //   // .get()
    //   // .then(documentSnapshot => {
    //   //   const temp = [];
    //   //   if (documentSnapshot) {
    //   //     documentSnapshot.docs.forEach(doc => {
    //   //       temp.push(doc.data());
    //   //     });
    //   //   }
    //   //   setMessage((prevState => [...prevState, ...temp]));
    //   // });
    //   // .onSnapshot(
    //   //   documentSnapshot => {
    //   //     const temp=[]
    //   //   if (documentSnapshot) {
    //   //
    //   //     documentSnapshot.docs.forEach(doc=>{
    //   //
    //   //       // console.log('1',new Date(doc.data().time.toDate()).toLocaleTimeString());
    //   //       //console.log(doc.data());
    //   //       temp.push(doc.data());
    //   //     })
    //   //   }
    //   //   setMessage((prevState => [...prevState,...temp]));
    //   // })
    //   .onSnapshot(snapshot => snapshot.docChanges().forEach(
    //     change => {
    //       const temp = [];
    //       if (change.type === "added") {
    //         console.log("old message: ", change.doc.data());
    //         if (change.doc.data().sender !== uid) {
    //           firestore()
    //             .collection(`Channels/${channelID}/messages`)
    //             .doc(change.doc.id)
    //             .update({
    //               seen: true,
    //             })
    //             .then(() => {
    //               //    console.log('User updated!');
    //             });
    //         }
    //
    //         temp.push({ ...change.doc.data(), id: change.doc.id });
    //       }
    //       if (change.type === "modified") {
    //         // console.log("new message: ", change.doc.data());
    //         if (change.doc.data().sender !== uid) {
    //           firestore()
    //             .collection(`Channels/${channelID}/messages`)
    //             .doc(change.doc.id)
    //             .update({
    //
    //               seen: true,
    //             })
    //             .then((d) => {
    //                   console.log('User updated!',d);
    //             });
    //         }
    //
    //         temp.push({ ...change.doc.data(), id: change.doc.id });
    //       }
    //
    //       setMessage((prevState => [...temp, ...prevState.filter(item => item.id !== change.doc.id)]));
    //     },
    //   ));
    //return () => subscriber();
  }, [items.id]);


  // useEffect(()=>{
  //   const last_ref = firestore().collection("Channels").doc(channelID/);
  //   console.log(last_ref,'llllll');
  // },[])


  const sendMessage = async () => {
    if (newMessage.trim().length > 0) {
      const message_ref = firestore().collection("Channels").doc(channelID).collection("messages").doc();
      const last_ref = firestore().collection("Channels").doc(channelID);
      const obj = {
        type: "text",
        sender: uid,
        text: newMessage,
        created_at: new Date(),
        updated_at: new Date(),
        seen: false,
      };

      message_ref.set(
        obj,
        { merge: true },
      ).then(async () => {
        setnewMessage("");

        dispatch({
          type: READ_MESSAGE,
          payload: { [channelID]: [{ message_id: message_ref.id, ...obj }, ...message] },
        });
      });

      last_ref.set({
        updated_at: new Date(),
        sender_id: uid,
        receiver_id: otherUserId,
        seen_by: false,
        last_message_type: "text",
        last_message: newMessage,
        message_id: message_ref.id,
      }).then();


      await axios.post("http://127.0.0.1:3000/sendmessages", {
        channelID: channelID,
        senderid: uid,
        text: newMessage,
        recieverid: otherUserId,
      });
    }
    // if (newMessage.trim().length > 0) {
    //   firestore()
    //     .collection("Channels")
    //     .doc(channelID)
    //     .collection("messages")
    //     .doc()
    //     .set(
    //       {
    //         type: "text",
    //         sender: uid,
    //         text: newMessage,
    //         time: new Date(),
    //         seen: false,
    //         // deleted_for_all:false,
    //       },
    //       { merge: true },
    //     )
    //     .then((res) => {
    //       console.log("Message added!");
    //       setnewMessage("");
    //       //call notification
    //       axios
    //         .post("http://127.0.0.1:3000/sendmessages", {
    //           channelID: channelID,
    //           senderid: uid,
    //           text: newMessage,
    //           recieverid: otherUserId,
    //         })
    //         .then((response) => {
    //           setnewMessage("");
    //
    //         })
    //         .catch((error) => {
    //           console.error(error, "w");
    //         });
    //
    //     //update last message
    //     //     firestore()
    //     //       .collection("Channels")
    //     //       .doc(channelID)
    //     //       .set(
    //     //         {
    //     //           member:[uid,otherUserId],
    //     //           type: "text",
    //     //           sender: uid,
    //     //           reciever: otherUserId,
    //     //           text: newMessage,
    //     //           updatedAt: new Date(),
    //     //           deleteForMe:false,
    //     //           deleted_for_all:false,
    //     //           seen: false,
    //     //           messageID:''
    //     //         }
    //     //       )
    //     //       .then(() => {
    //     //         console.log("Last message updated!");
    //     //       })
    //     //       .catch(e => {
    //     //         console.log(e);
    //     //       });
    //
    //     })
    //     .catch(e => {
    //       console.log(e);
    //     });
    // }
  };

  const deleteForMe = () => {

    setModalVisible(!modalVisible);
    console.log("pressed", selectedID.current, messageSenderID.current, uid);
    if (selectedID.current) {
      console.log("my message");
      firestore()
        .collection("Channels")
        .doc(channelID)
        .collection("messages")
        .doc(selectedID.current)
        .set({
            deleted_for_me: firestore.FieldValue.arrayUnion(uid),
          }
          , {
            merge: true,
          })
        .then(() => {
          console.log("message deleted_for_all!");
        });

      firestore()
        .collection("Channels")
        .doc(channelID)
        .set(
          {
            updated_at: new Date(),
            sender_id: uid,
            receiver_id: otherUserId,
            seen_by: false,
            last_message_type: "text",
            last_message: newMessage,
            message_id: message_ref.id,
            deleted_for_me: firestore.FieldValue.arrayUnion(uid),
          }
          , { merge: true },
        ).then();

    } else {
      console.log("sss");
    }
  };
  const deleteForEveryone = () => {
    console.log("delete for me", selectedID.current);
    setModalVisible(!modalVisible);
    console.log("pressed", selectedID.current, messageSenderID.current, uid);
    if (selectedID.current && messageSenderID.current === uid) {
      console.log("1111", selectedID.current);
      firestore()
        .collection("Channels")
        .doc(channelID)
        .collection("messages")
        .doc(selectedID.current)
        .set({
          deleted_for_all: true,
          updated_at: new Date(),
        }, {
          merge: true,
        })
        .then(() => {

          console.log("message deleted!");

          const allmessages = [...message];

          let index = allmessages.findIndex(o => o.message_id === selectedID.current);
          let obj1 = { ...allmessages[index], updated_at: new Date(), deleted_for_all: true };
          allmessages[index] = obj1;
          dispatch({
            type: READ_MESSAGE,
            payload: { [channelID]: allmessages },
          });

        });
      // console.log('messsages',message);
      // firestore()
      //   .collection("Channels")
      //   .doc(channelID)
      //   .set({
      //     updated_at: new Date(),
      //     deleted_for_all: true,
      //   }, {
      //     merge: true,
      //   }).then();
    }
  };


  const onLongPress = (messageID, senderID) => {
    selectedID.current = messageID;
    messageSenderID.current = senderID;
    //console.log(selectedID.current,messageSenderID.current,'aaaa');
    setModalVisible(true);

  };


  const keyExtractor = (item, idx) => {
    return item?.message_id;
  };
  const renderItem = ({ item, index }) => {
    return <MessageView message={item} onLongPress={onLongPress} />;

  };

  const launchCamera = async () => {
    const options = {
      maxWidth: 2000,
      maxHeight: 2000,
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };
    await ImagePicker.launchImageLibrary(options, response => {


      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response?.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response?.customButton) {
        console.log("User tapped custom button: ", response.customButton);
        alert(response.customButton);
      } else {
        const source = response.assets[0].uri;
        //
        // console.log('1',source);
        // navigation.navigate('SelectImage',{image:source})

        let m1 = new Date();
        storage().ref(`messages/${channelID}/${m1}.jpg`).putFile(source, {
          cacheControl: "no-store", // disable caching
        }).then((res) => {
          console.log(source);
          const picRef = storage().ref(`messages/${channelID}/${m1}.jpg`);
          picRef
            .getDownloadURL()
            .then(url => {

              if (url) {
                console.log("=========download url===========", url);
                firestore()
                  .collection("Channels")
                  .doc(channelID)
                  .collection("messages")
                  .doc()
                  .set(
                    {
                      type: "image",
                      sender: uid,
                      image: url,
                      time: new Date(),
                      seen: false,
                    },
                    { merge: true },
                  )
                  .then(() => {
                    console.log("Message added!");
                    setnewMessage("");
                  })
                  .catch(e => {
                    console.log(e);
                  });
              }
            })
            .catch(error => {
              console.log("Error getting image 1: ", error.message);
            });
        });


        // const result = email.split('@')[0];
      }
    });
  };
  const bg = "https://i.pinimg.com/originals/40/39/e0/4039e0f1ef08b7b965bacb4641a7af49.jpg";
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#222D36" }}>
      <StatusBar barStyle="light-content" />

      {modalVisible &&
        <Modal
          animationType={false}
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            // Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Delete message?</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={deleteForMe}
                // onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>DELETE FOR ME</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>CANCEL</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={deleteForEveryone}
              >
                <Text style={styles.textStyle}>DELETE FOR EVERYONE</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      }
      <KeyboardAvoidingView
        behavior={"padding"}
        style={{ flex: 1 }}>

        {/*Header*/}
        <View style={{ flexDirection: "row", backgroundColor: "#222D36", padding: 10 }}>

          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity style={{ justifyContent: "center", alignItems: "center" }}
                              onPress={() => navigation.navigate("Home")}>
              <Icon name="arrow-back-outline" size={30} color="#fff" />
            </TouchableOpacity>

            <View style={styles.placeholder}>

              {
                imageUrl === "" ? <Text style={styles.txt}>{items.name[0]}</Text> :
                  <Image source={{ uri: imageUrl }} style={{ width: "100%", height: "100%" }} />
              }
            </View>
          </View>


          <View style={styles.contactDat}>
            <Text style={styles.name}>
              {items?.name}
            </Text>
            {!!userStatus
              ? <Text style={{ color: "#fff", marginTop: 5 }}>Online</Text>
              : <Text style={{ color: "#fff", marginTop: 5 }}>{`last seen at ${userLastSeen}`}</Text>
            }
          </View>
        </View>


        <View style={{ flex: 1 }}>
          <Image source={{ uri: bg }}
                 style={StyleSheet.absoluteFillObject} />
          <FlatList
            inverted
            ref={flatlistRef}
            // onContentSizeChange={w => {
            //   flatlistRef.current.scrollToEnd();
            // }}
            data={message}
            contentContainerStyle={{ flexGrow: 1, paddingVertical: 15 }}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            style={{ flex: 1 }}
          />


        </View>


        {/*Footer*/}
        <View style={styles.footer}>

          <TouchableOpacity onPress={launchCamera} style={styles.emoji}>
            <Icon name="camera" size={30} color="grey" />
          </TouchableOpacity>
          {/*<View style={{ flex: 1,alignSelf:'center' }}>*/}
          <View style={{ flex: 1 }}>
            <TextInput
              placeholder="Message"
              placeholderTextColor="grey"
              value={newMessage}
              onChangeText={(t) => setnewMessage(t)}
              style={styles.input} />
          </View>
          <TouchableOpacity onPress={sendMessage} style={styles.send}>
            <Icon name="send-outline" size={27} color="white" />
          </TouchableOpacity>


        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  contactCon: {
    flex: 1,
    flexDirection: "row",
    padding: 15,
    // backgroundColor: 'red',
    borderBottomWidth: 0.5,
  },
  placeholder: {
    flexDirection: "row",
    width: 55,
    height: 55,
    borderRadius: 30,
    overflow: "hidden",
    //backgroundColor: '#101D24',
    alignItems: "center",
    justifyContent: "center",
  },
  contactDat: {
    flex: 1,

    paddingLeft: 25,

    //paddingTop: 15,
  },
  txt: {
    fontSize: 18,
  },
  name: {
    color: "#fff",
    fontSize: 20,
  },
  footer: {

    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: 10,
    width: "80%",
    height: 60,
    borderRadius: 40,
    bottom: -10,
    backgroundColor: "#324452",
  },
  emoji: {
    justifyContent: "center",
    alignItems: "center",
    width: "15%",
    height: "100%",
    marginLeft: 10,
    //backgroundColor:'red'
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
    height: "85%",
    backgroundColor: "#00D789",
    left: 60,
    borderRadius: 30,
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  centeredView: {
    flex: 1,
    // backgroundColor:'red',
    justifyContent: "center",
    alignItems: "center",


  },
  modalView: {

    width: "80%",
    backgroundColor: "#222D36",
    borderRadius: 10,
    marginHorizontal: 35,
    padding: 10,
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 20,
    elevation: 2,
    alignSelf: "flex-end",
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    // backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "#00D789",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    fontSize: 20,
    marginBottom: 15,
    alignSelf: "flex-start",
    textAlign: "left",
    color: "white",
  },
});

export default ChatMainScreen;


// return (
//   <View style={{ flex: 1 }}>
//
//     <View style={{ flexDirection: "row", backgroundColor: "#222D36", padding: 10 }}>
//       <View style={styles.placeholder}>
//         {
//           imageUrl === "" ? <Text style={styles.txt}>{items.name[0]}</Text> :
//             <Image source={{ uri: imageUrl }} style={{ width: "100%", height: "100%" }} />
//         }
//       </View>
//       <View style={styles.contactDat}>
//         <Text style={styles.name}>
//           {items?.name}
//         </Text>
//       </View>
//     </View>
//
//
//     <KeyboardAvoidingView
//       behavior={"padding"}
//       keyboardVerticalOffset={100}
//       style={styles.keyboardavoid}
//     >
//       <View style={{
//         justifyContent: "center",
//         alignItems: "center",
//         width: "15%",
//         height: "100%",
//         marginHorizontal: 10,
//         marginTop: 5,
//       }}>
//         <Icon name="happy-outline" size={30} color="grey" style={{ position: "absolute" }} />
//       </View>
//       <View style={{ flex: 1 }}>
//         <TextInput placeholder="type"
//                    style={{ color: "#fff", width: "120%", height: "100%", position: "absolute" }} />
//       </View>
//       <View
//         style={{
//           justifyContent: "center",
//           alignItems: "center",
//           width: "15%",
//           backgroundColor: "#00D789",
//           left: 60,
//           borderRadius: 30,
//         }}>
//         <Icon name="send-outline" size={27} color="white" style={{ position: "absolute" }} />
//       </View>
//     </KeyboardAvoidingView>
//     {/*<Image source={{ uri: "https://i.pinimg.com/originals/40/39/e0/4039e0f1ef08b7b965bacb4641a7af49.jpg" }}*/}
//     {/*       style={{ height: "100%", width: "100%" }} />*/}
//
//   </View>
// );
