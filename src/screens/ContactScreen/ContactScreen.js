import React, {useEffect, useRef, useState} from 'react';
import {View, Text, SafeAreaView, StyleSheet, FlatList} from 'react-native';
import Contact from './Contact';
import Contacts from 'react-native-contacts';
import database from '@react-native-firebase/database';
import {useDispatch, useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import {setToken} from '../../store/actions/users';
import storage from '@react-native-firebase/storage';

const ContactScreen = ({navigation}) => {
  const [contacts, setContacts] = useState([]);
  let cno = useRef([]);
  let cnoDB = useRef([]);
  let cnoPhone = useRef([]);
  const [datadb, setdatadb] = useState([]);

  const dispatch = useDispatch();

  const uid = useSelector(state => state.user.token);

  useEffect(() => {
    Contacts.getAll()
      .then(contacts => {
        for (let key in contacts) {
          let contactdb1 = contacts[key].phoneNumbers[0].number.replace(
            /\D/g,
            '',
          );
          let check = cnoPhone.current.includes(contactdb1);
          if (!check) {
            cnoPhone.current.push(contactdb1);
          }
        }
        setContacts(contacts);
        // console.log('cnoPhone',cnoPhone);
      })
      .then(() => {
        for (let key in cnoPhone.current) {
          // console.log('key',cnoPhone.current[key])
          // database()
          //   .ref(`/users`)
          //   .orderByChild("phone")
          //   .equalTo(`+91${cnoPhone.current[key]}`)
          //   .once("value")
          //   .then(snapshot => {
          // const data = snapshot.val();
          // if (data) {
          //   setdatadb(data);
          //   // console.log("User data: ",snapshot.val());
          // }
          //
          // for (let key in data) {
          //   let check = cnoDB.current.includes(data[key].phone.slice(3));
          //   if (!check) {
          //     cnoDB.current.push(data[key].phone.slice(3));
          //   }
          // }
          // console.log('Dddd', cnoDB.current, cnoPhone.current);
          firestore()
            .collection('Users')
            // Filter results
            .where('phone', '==', `+91${cnoPhone.current[key]}`)
            .get()
            .then(querySnapshot => {
              querySnapshot.forEach(d => {
                // console.log('User ID: ', d.id, d.data());
                const data = d.data();
                if (data) {
                  setdatadb(data);
                  // console.log("User data: ",data);
                }

                for (let key in data) {
                  // console.log(data.phone.slice(3,));
                  let check = cnoDB.current.includes(data.phone.slice(3));
                  if (!check) {
                    console.log('1');
                    cnoDB.current.push(data.phone.slice(3));
                  }
                }
                // console.log('Dddd', cnoDB.current, cnoPhone.current);
              });
            });
        }
      });
  }, []);

  // console.log("DDDD", contacts)

  const startChat = contact => {
    let obj = {};
    const contactno = contact.phoneNumbers[0].number.replace(/\D/g, '');
    // database()
    //   .ref(`/users`)
    //   .orderByChild("phone")
    //   .equalTo(`+91${contactno}`)
    //   .once("value")
    //   .then(snapshot => {
    // const data = snapshot.val();
    // let uid2=Object.keys(data)[0]
    //
    // const isUser = cnoDB.current.includes(contactno);
    // // console.log("isUser", isUser,contactno);
    // if (isUser) {
    //   // console.log('ID',uid,uid2);

    firestore()
      .collection('Users')
      .where('phone', '==', `+91${contactno}`)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(d => {
          // console.log('User ID: ', d.id, d.data());
          let image = d.id + '.jpg';
          obj.id = d.id;
          obj.name = d.data().name;
          obj.phone = d.data().phone;
          storage()
            .ref(image)
            .getDownloadURL()
            .then(res => {
              // console.log(res);
              obj.image = res;

              let otherUserId = d.id;
              const isUser = cnoDB.current.includes(contactno);
              if (isUser) {
                console.log('yes');

                firestore()
                  .collection('Channels')
                  .doc(uid + otherUserId)
                  .get()
                  .then(querySnapshot => {
                    if (querySnapshot.data()) {
                      console.log('1');
                      console.log('already in', obj);
                      navigation.navigate('ChatMainScreen', {
                        item: obj,
                        channelID: uid + otherUserId,
                      });
                    } else {
                      firestore()
                        .collection('Channels')
                        .doc(otherUserId + uid)
                        .get()
                        .then(querySnapshot => {
                          console.log('query data==', querySnapshot.data());
                          if (querySnapshot.data()) {
                            console.log('already in123', obj);
                            navigation.navigate('ChatMainScreen', {
                              item: obj,
                              channelID: otherUserId + uid,
                            });
                          } else {
                            console.log('creating new channel');
                            firestore()
                              .collection('Channels')
                              .doc(uid + otherUserId)
                              .set(
                                {
                                  members: [uid, otherUserId],
                                  created_at: new Date(),
                                  updated_at: new Date(),
                                  created_by: uid,
                                  sender_id: '',
                                  receiver_id: '',
                                  seen_by: false,
                                  last_message_type: '',
                                  last_message: '',
                                  message_id: '',
                                },
                                {merge: true},
                              )
                              .then(() => {
                                console.log('Channel added!');
                                navigation.navigate('ChatMainScreen', {
                                  item: obj,
                                  channelID: otherUserId + uid,
                                });
                              })
                              .catch(e => {
                                console.log(e);
                              });
                          }
                        });

                      //   database()
                      //     .ref(`/channels/${uid+otherUserId}`)
                      //     .set({
                      //       members:[uid,otherUserId],
                      //       // messages:[
                      //       //  senderid,messages,messageid,time,date,
                      //       //   ],
                      //       })
                      //     .then(() => {
                      //       console.log('Data set.');
                      //
                      //       navigation.navigate("Home");
                      //     })
                      //   //
                      // }
                    }
                  });
              }
            })
            .catch(e => {
              console.log('error', e);
            });
        });
      });
  };

  const keyExtractor = (item, idx) => {
    return item?.recordID?.toString() || idx.toString();
  };

  const renderItem = ({item, index}) => {
    return <Contact contact={item} OnPress={startChat} />;
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#101D24'}}>
      {contacts && (
        <FlatList
          data={contacts}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          style={styles.list}
        />
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
});

export default ContactScreen;
