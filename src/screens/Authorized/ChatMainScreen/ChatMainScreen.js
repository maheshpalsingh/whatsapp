import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  StatusBar,
  Pressable,
  ActivityIndicator,
  Keyboard,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import firestore, {FieldValue} from '@react-native-firebase/firestore';
import {useDispatch, useSelector} from 'react-redux';
import * as ImagePicker from 'react-native-image-picker';
import MessageView from './MessageView';
import '@react-native-firebase/messaging';
import {useNavigation} from '@react-navigation/native';

import storage, {firebase} from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import {
  setTotatChat,
  readAllMessages,
  readChannelDetails,
  readNewMessage,
} from '../../../store/actions/messages';
import {READ_MESSAGE} from '../../../store/actions/messages';
import FastImage from 'react-native-fast-image';

const ChatMainScreen = ({route}) => {
  const navigation = useNavigation();
  const totalChat = useSelector(state => state.message.total_read);
  const [userStatus, setStatus] = useState(false);
  const [userLastSeen, setLastSeen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const selectedID = useRef();
  const messageSenderID = useRef();
  const flatlistRef = useRef();
  const uid = useSelector(state => state.user.myid);
  const channelDetails = route?.params?.item;
  //console.log(channelDetails);
  const [animating, setAnimating] = useState(false);

  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);

  const openModal = () => {
    setModalVisible1(!modalVisible1);
  };
  const openModal2 = () => {
    setModalVisible2(!modalVisible2);
  };

  const [newMessage, setnewMessage] = useState('');
  const getMessage = useSelector(
    state => state.message.messages[channelDetails?.id],
  );

  const getchannelDetails = useSelector(state => state.message.channelDetails);

  const subscriber = useRef();

  const message = getMessage || [];
  const channelRef = firestore().collection('Channels').doc(channelDetails?.id);

  const dispatch = useDispatch();
  const reciever = channelDetails?.members.filter(myid => myid !== uid);
  const recieverid = reciever.toString();
  const recieverName = channelDetails?.users_details?.[recieverid].name;
  const recieverProfile = channelDetails?.users_details?.[recieverid].profile;
  const recieverPhone = channelDetails?.users_details?.[recieverid].phone;
  const recieverStatus = channelDetails?.users_details?.[recieverid].about;

  const db = firestore().collection('Channels').doc(channelDetails?.id);

  const getAllMessages = async () => {
    dispatch(readAllMessages(channelDetails?.id));
  };
  const lastVisible = message[0]?.created_at;
  const getNewMessage = async () => {
    dispatch(readNewMessage(channelDetails?.id, lastVisible));
  };

  useEffect(() => {
    // console.log('================', message);
    if (message.length === 0) {
      console.log('initial');
      getAllMessages().then();
    } else {
      console.log('update');
      getNewMessage().then();
    }
  }, [channelDetails?.id]);

  useEffect(() => {
    // console.log('messaghe', message);
    const messageids = message?.filter(
      item => item?.sender !== uid && !item?.seen,
    );

    messageids.forEach(item => {
      firestore()
        .collection(`Channels/${channelDetails?.id}/messages`)
        .doc(item.message_id)
        .set(
          {
            seen: true,
            updated_at: new Date(),
          },
          {
            merge: true,
          },
        )
        .then(() => {
          console.log('total chat', totalChat);
          let newTotal = totalChat - 1;
          console.log('totalChat111', newTotal);

          dispatch(setTotatChat(newTotal));
          channelRef.set(
            {
              updated_at: new Date(),
              seen: true,
              read_count: 0,
            },
            {
              merge: true,
            },
          );
        });
    });
  }, [message]);

  useEffect(() => {
    database()
      .ref(`/online/${recieverid}`)
      .on('value', snapshot => {
        // console.log('1111User data: ', snapshot.val());
        setStatus(snapshot.val()?.isActive);
        setLastSeen(snapshot.val()?.lastSeen?.slice(0, 21));
      });

    return () => subscriber.current && subscriber.current();
  }, []);

  useEffect(() => {
    subscriber.current = channelRef
      .collection('messages')
      .where('updated_at', '>=', new Date())
      .onSnapshot(snapshot =>
        snapshot.docChanges().forEach(change => {
          // console.log('check', change.type);
          if (change.type === 'added') {
            const messageId = change.doc.id;
            const data = change.doc.data();
            // if (data.sender !== uid) {
            const matchIndex = message.findIndex(
              item => item.message_id === messageId,
            );

            if (matchIndex >= 0) {
              const allmessages = [...message];
              let obj1 = {
                ...data,
                created_at: data?.created_at?.toDate(),
                updated_at: data?.updated_at?.toDate(),
                message_id: messageId,
              };
              allmessages[matchIndex] = obj1;
              dispatch({
                type: READ_MESSAGE,
                payload: {[channelDetails?.id]: allmessages},
              });
            } else {
              const finalData = {
                ...data,
                created_at: data?.created_at?.toDate(),
                updated_at: data?.updated_at?.toDate(),
              };
              // console.log('final data', finalData);

              const details = [
                {...finalData, message_id: messageId},
                ...message,
              ];
              // console.log('Detailsss', details);
              dispatch({
                type: READ_MESSAGE,
                payload: {
                  [channelDetails?.id]: details,
                },
              });
            }
          }
          // }
        }),
      );

    return () => subscriber.current && subscriber.current();
  }, [message]);

  const sendMessage = async () => {
    if (newMessage.trim().length > 0) {
      const message_ref = channelRef.collection('messages').doc();

      const obj = {
        type: 'text',
        sender: uid,
        text: newMessage.trim(),
        created_at: new Date(),
        updated_at: new Date(),
        seen: false,
        // last_message_seen: false,
      };

      message_ref.set(obj, {merge: true}).then(async () => {
        dispatch({
          type: READ_MESSAGE,
          payload: {
            [channelDetails?.id]: [
              {message_id: message_ref.id, ...obj},
              ...message,
            ],
          },
        });
      });

      channelRef.set(
        {
          updated_at: new Date(),
          sender_id: uid,
          receiver_id: recieverid,
          seen: false,
          deleted_for_all: false,
          last_message_type: 'text',
          last_message: newMessage,
          //last_message_seen: false,
          message_id: message_ref.id,
          read_count: firestore.FieldValue.increment(1),
        },
        {
          merge: true,
        },
      );

      setnewMessage('');

      // await axios.post('http://127.0.0.1:3000/sendmessages', {
      //   channelID: channelDetails?.id,
      //   senderid: uid,
      //   text: newMessage,
      //   recieverid: recieverid,
      // });
    }
  };

  const deleteForMe = () => {
    setModalVisible(!modalVisible);
    // console.log('pressed', selectedID.current, messageSenderID.current, uid);
    if (selectedID.current) {
      channelRef
        .collection('messages')
        .doc(selectedID.current)
        .set(
          {
            deleted_for_me: firebase.firestore.FieldValue.arrayUnion(uid),
            updated_at: new Date(),
          },
          {
            merge: true,
          },
        )
        .then(() => {
          // console.log('message deleted_for_me');

          const allmessages = [...message];
          let index = allmessages.findIndex(
            o => o.message_id === selectedID.current,
          );
          let obj1 = {
            ...allmessages[index],
            deleted_for_me: [uid],
          };
          allmessages[index] = obj1;

          dispatch({
            type: READ_MESSAGE,
            payload: {[channelDetails?.id]: allmessages},
          });

          if (index === 0) {
            console.log('last message');
            let updateLastMessage = allmessages[1].text;
            //console.log('updateLastMessage', updateLastMessage);
            //console.log('data', getchannelDetails);

            let index1 = getchannelDetails.findIndex(
              o => o.id === channelDetails?.id,
            );
            let allChannel = getchannelDetails;
            //console.log('index1', index1);
            let updateChannel = {
              ...allChannel[index1],
              last_message: updateLastMessage,
            };
            allChannel[index1] = updateChannel;
            //console.log('updateChannel', allChannel);
            dispatch(readChannelDetails(allChannel));
            // dispatch(messageActions.readChannelDetails());
          }
          // channelRef.get().then(document => {
          //   if (document.data().message_id === selectedID.current) {
          //     console.log('dfsgvfd');
          //     let updateLastMessage = allmessages[1].text;
          //     if (allmessages[1].type !== 'text') {
          //       updateLastMessage = 'Photo';
          //     }
          //     console.log('last', updateLastMessage);
          //     channelRef
          //       .set(
          //         {
          //           last_message: updateLastMessage,
          //           last_message_type:
          //             updateLastMessage === 'Photo' ? 'photo' : 'text',
          //           deleted_for_me:
          //             firebase.firestore.FieldValue.arrayUnion(uid),
          //           updated_at: new Date(),
          //         },
          //         {merge: true},
          //       )
          //       .then(() => setnewMessage(''));
          //   }
          // });
        });
    } else {
      console.log('sss');
    }
  };
  const deleteForEveryone = () => {
    // console.log('delete for everyone', selectedID.current);
    setModalVisible(!modalVisible);
    console.log('pressed', selectedID.current, messageSenderID.current, uid);
    if (selectedID.current && messageSenderID.current === uid) {
      console.log('1111', selectedID.current);
      channelRef
        .collection('messages')
        .doc(selectedID.current)
        .set(
          {
            deleted_for_all: true,
            updated_at: new Date(),
          },
          {
            merge: true,
          },
        )
        .then(() => {
          // console.log('message deleted!');
          const temp = [];
          const allmessages = [...message];
          let index = allmessages.findIndex(
            o => o.message_id === selectedID.current,
          );
          let obj1 = {
            ...allmessages[index],
            updated_at: new Date(),
            deleted_for_all: true,
          };
          // console.log('obj1', obj1);
          allmessages[index] = obj1;
          dispatch({
            type: READ_MESSAGE,
            payload: {[channelDetails?.id]: allmessages},
          });

          const last_ref = channelRef.get().then(document => {
            const mss_id = document.data().message_id;

            console.log('mss', mss_id);
            if (mss_id === selectedID.current) {
              channelRef
                .set(
                  {
                    updated_at: new Date(),
                    deleted_for_all: true,
                  },
                  {merge: true},
                )
                .then();
            }
          });
        });
    }
  };

  const onLongPress = (messageID, senderID) => {
    selectedID.current = messageID;
    messageSenderID.current = senderID;
    //console.log(selectedID.current,messageSenderID.current,'aaaa');
    setModalVisible(true);
  };

  const clearChats = () => {
    console.log('clear chats');
    setModalVisible2(!modalVisible2);

    channelRef
      .collection('messages')
      .where('updated_at', '<=', new Date())
      .get()
      .then(querySnapshot =>
        querySnapshot.forEach(documentSnapshot => {
          channelRef
            .collection('messages')
            .doc(documentSnapshot.id)
            .set(
              {
                deleted_for_me: firebase.firestore.FieldValue.arrayUnion(uid),
                updated_at: new Date(),
              },
              {
                merge: true,
              },
            )
            .then(() => {
              channelRef.set(
                {
                  updated_at: new Date(),
                  last_message_type: '',
                  last_message: '',
                },
                {merge: true},
              );

              dispatch({
                type: READ_MESSAGE,
                payload: {[channelDetails?.id]: []},
              });
            });
        }),
      );
  };

  const keyExtractor = (item, idx) => {
    return item?.message_id;
  };
  const renderItem = ({item, index}) => {
    return <MessageView message={item} onLongPress={onLongPress} />;
  };

  const launchCamera = async () => {
    setAnimating(true);

    const options = {
      maxWidth: 2000,
      maxHeight: 2000,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    await ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response?.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response?.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const source = response.assets[0].uri;

        let m1 = new Date();
        storage()
          .ref(`messages/${channelDetails?.id}/${m1}.jpg`)
          .putFile(source, {
            cacheControl: 'no-store', // disable caching
          })
          .then(res => {
            const picRef = storage().ref(
              `messages/${channelDetails?.id}/${m1}.jpg`,
            );
            picRef
              .getDownloadURL()
              .then(url => {
                if (url) {
                  const message_ref = channelRef.collection('messages').doc();

                  const obj = {
                    type: 'photo',
                    sender: uid,
                    image: url,
                    created_at: new Date(),
                    updated_at: new Date(),
                    seen: false,
                  };

                  message_ref.set(obj, {merge: true}).then(async () => {
                    dispatch({
                      type: READ_MESSAGE,
                      payload: {
                        [channelDetails?.id]: [
                          {message_id: message_ref.id, ...obj},
                          ...message,
                        ],
                      },
                    });
                  });

                  channelRef.set(
                    {
                      updated_at: new Date(),
                      sender_id: uid,
                      receiver_id: recieverid,
                      seen: false,
                      deleted_for_all: false,
                      last_message_type: 'photo',
                      image: url,
                      //last_message_seen: false,
                      message_id: message_ref.id,
                    },
                    {
                      merge: true,
                    },
                  );
                }
              })
              .catch(error => {
                console.log('Error getting image 1: ', error.message);
              });
          });
      }
    });
    setAnimating(false);
  };

  const recordVoice = () => {
    console.log('recording...');
  };

  const bg =
    'https://i.pinimg.com/originals/40/39/e0/4039e0f1ef08b7b965bacb4641a7af49.jpg';
  return (
    <>
      {/* <SafeAreaView style={{flex: 0, backgroundColor: '#222D36'}} /> */}
      <SafeAreaView style={{flex: 1, backgroundColor: '#222D36'}}>
        <StatusBar barStyle="light-content" />

        {modalVisible && (
          <Modal
            animationType={false}
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              // Alert.alert("Modal has been closed.");
              setModalVisible(!modalVisible);
            }}>
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
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={styles.textStyle}>CANCEL</Text>
                </Pressable>
                {messageSenderID.current === uid && (
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={deleteForEveryone}>
                    <Text style={styles.textStyle}>DELETE FOR EVERYONE</Text>
                  </Pressable>
                )}
              </View>
            </View>
          </Modal>
        )}

        {modalVisible2 && (
          <Modal
            animationType={false}
            transparent={true}
            visible={modalVisible2}
            onRequestClose={() => {
              // Alert.alert("Modal has been closed.");
              setModalVisible2(!modalVisible2);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView2}>
                <View
                  style={{
                    fontSize: 20,
                    margin: 10,
                    paddingLeft: 10,
                    alignSelf: 'flex-start',
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      color: 'white',
                      fontWeight: '600',
                      paddingBottom: 20,
                    }}>
                    Clear this chat?
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      color: '#999999',
                      fontWeight: '600',
                      paddingBottom: 20,
                      lineHeight: 22,
                    }}>
                    Message will only be removed from this device and your
                    devices on the newer versions of WhatsApp.
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'flex-end',
                  }}>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisible2(!modalVisible2)}>
                    <Text style={styles.textStyle}>CANCEL</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={clearChats}>
                    <Text style={styles.textStyle}>CLEAR CHAT</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        )}

        <KeyboardAvoidingView behavior={'padding'} style={{flex: 1}}>
          {/*Header*/}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('UserDetail', {
                recieverid,
                recieverProfile,
                recieverName,
                recieverPhone,
                recieverStatus,
              })
            }
            style={{
              flexDirection: 'row',
              backgroundColor: '#222D36',
              padding: 10,
            }}>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  alignchannelDetails: 'center',
                }}
                onPress={() => navigation.navigate('Home')}>
                <Icon name="arrow-back-outline" size={30} color="#fff" />
              </TouchableOpacity>

              <View style={styles.placeholder}>
                {recieverProfile === '' ? (
                  <Text style={styles.txt}>{recieverName[0]}</Text>
                ) : (
                  <FastImage
                    source={{
                      uri: recieverProfile,
                    }}
                    style={{width: '100%', height: '100%'}}
                  />
                )}
              </View>
            </View>

            <View style={styles.contactDat}>
              <Text style={styles.name}>{recieverName}</Text>
              {!!userStatus ? (
                <Text style={{color: '#fff', marginTop: 5}}>Online</Text>
              ) : (
                <Text
                  style={{
                    color: '#fff',
                    marginTop: 5,
                  }}>{`last seen at ${userLastSeen}`}</Text>
              )}
            </View>
            <TouchableOpacity
              style={{justifyContent: 'center', alignchannelDetails: 'center'}}
              onPress={openModal}>
              <Icon name="ellipsis-vertical" size={20} color="#fff" />
            </TouchableOpacity>
          </TouchableOpacity>

          <View style={{flex: 1}}>
            <ImageBackground
              source={{uri: bg}}
              style={StyleSheet.absoluteFillObject}>
              {modalVisible1 && (
                <Modal
                  animationType={false}
                  transparent={true}
                  visible={modalVisible1}
                  onRequestClose={() => {
                    // Alert.alert("Modal has been closed.");
                    setModalVisible1(!modalVisible1);
                  }}>
                  <TouchableOpacity
                    style={styles.centeredView1}
                    activeOpacity={1}
                    onPressOut={() => setModalVisible1(!modalVisible1)}>
                    <View style={styles.modalView1}>
                      <Pressable
                        style={{
                          paddingTop: 15,
                        }}
                        onPress={() => {
                          setModalVisible1(!modalVisible1);

                          navigation.navigate('UserDetail', {
                            recieverid,
                            recieverProfile,
                            recieverName,
                            recieverPhone,
                          });
                        }}>
                        <Text style={styles.modalText1}>View contact</Text>
                      </Pressable>
                      <Pressable
                        style={{
                          paddingTop: 15,
                        }}
                        onPress={() => {
                          setModalVisible1(!modalVisible1);
                          setModalVisible2(!modalVisible2);
                        }}>
                        <Text style={styles.modalText1}>Clear Chats</Text>
                      </Pressable>
                    </View>
                  </TouchableOpacity>
                </Modal>
              )}
              <FlatList
                inverted
                ref={flatlistRef}
                data={message}
                contentContainerStyle={{flexGrow: 1, paddingVertical: 15}}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                style={{flex: 1}}
              />
              {animating && (
                <ActivityIndicator
                  size="large"
                  color="#00ff00"
                  animating={animating}
                />
              )}
            </ImageBackground>
          </View>

          {/*Footer*/}
          <View style={styles.footer}>
            <TouchableOpacity onPress={launchCamera} style={styles.emoji}>
              <Icon name="camera" size={30} color="grey" />
            </TouchableOpacity>
            {/*<View style={{ flex: 1,alignSelf:'center' }}>*/}
            <View style={{flex: 1, flexDirection: 'row'}}>
              <TextInput
                placeholder="Message"
                placeholderTextColor="grey"
                value={newMessage}
                multiline={true}
                keyboardType="url"
                onChangeText={t => {
                  setnewMessage(t);
                }}
                style={styles.input}
              />
              {/* <TouchableOpacity
              onPress={recordVoice}
              style={{
                justifyContent: 'center',
                right: 40,
              }}>
              <Icon name="mic" size={30} color="grey" />
            </TouchableOpacity> */}
            </View>
            <TouchableOpacity onPress={sendMessage} style={styles.send}>
              <Icon
                name="send-outline"
                size={27}
                color="white"
                style={{alignSelf: 'center'}}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  contactCon: {
    flex: 1,
    flexDirection: 'row',
    padding: 15,
    // backgroundColor: 'red',
    borderBottomWidth: 0.5,
  },
  placeholder: {
    flexDirection: 'row',
    width: 55,
    height: 55,
    borderRadius: 30,
    overflow: 'hidden',
    //backgroundColor: '#101D24',
    alignchannelDetails: 'center',
    justifyContent: 'center',
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
    color: '#fff',
    fontSize: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 10,
    width: '80%',
    height: 60,
    borderRadius: 40,
    bottom: -10,
    backgroundColor: '#324452',
  },
  emoji: {
    justifyContent: 'center',
    alignchannelDetails: 'center',
    width: '15%',
    height: '100%',
    marginLeft: 10,
    //backgroundColor:'red'
  },
  input: {
    paddingTop: 15,
    color: '#fff',
    fontSize: 20,
    width: '120%',
    height: '100%',
    // position: "absolute",
    //backgroundColor: "red",
  },
  send: {
    marginTop: 2,
    justifyContent: 'center',
    alignchannelDetails: 'center',
    width: '16%',
    height: '85%',
    backgroundColor: '#00D789',
    left: 60,
    borderRadius: 30,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignchannelDetails: 'center',
  },
  modalView: {
    width: '80%',
    backgroundColor: '#222D36',
    borderRadius: 10,
    marginHorizontal: 35,
    padding: 10,
    paddingVertical: 20,
    justifyContent: 'center',
    alignchannelDetails: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalView2: {
    backgroundColor: '#222D36',
    padding: 10,
    paddingVertical: 20,
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
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
    alignSelf: 'flex-end',
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    // backgroundColor: "#2196F3",
  },
  textStyle: {
    color: '#00D789',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 20,
    marginBottom: 15,
    alignSelf: 'flex-start',
    textAlign: 'left',
    color: 'white',
  },
  modalText1: {
    fontSize: 16,
    marginBottom: 15,
    alignSelf: 'flex-start',
    textAlign: 'left',
    color: 'white',
  },

  centeredView1: {
    flex: 1,
    alignItems: 'flex-end',
    marginTop: 50,
  },
  modalView1: {
    width: '50%',
    justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '#222D36',
    borderRadius: 2,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.56,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default ChatMainScreen;

// return (
//   <View style={{ flex: 1 }}>
//
//     <View style={{ flexDirection: "row", backgroundColor: "#222D36", padding: 10 }}>
//       <View style={styles.placeholder}>
//         {
//           imageUrl === "" ? <Text style={styles.txt}>{channelDetails.name[0]}</Text> :
//             <Image source={{ uri: imageUrl }} style={{ width: "100%", height: "100%" }} />
//         }
//       </View>
//       <View style={styles.contactDat}>
//         <Text style={styles.name}>
//           {channelDetails?.name}
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
//         alignchannelDetails: "center",
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
//           alignchannelDetails: "center",
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
