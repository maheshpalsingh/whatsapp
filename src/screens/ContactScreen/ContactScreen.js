import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView, StyleSheet, FlatList} from 'react-native';
import Contact from './Contact';
import Contacts from 'react-native-contacts';

import {useDispatch, useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';

import storage from '@react-native-firebase/storage';

const ContactScreen = ({navigation}) => {
  const [contacts, setContacts] = useState([]);
  let cno = useRef([]);
  let cnoDB = useRef([]);
  let cnoPhone = useRef([]);
  const [datadb, setdatadb] = useState([]);

  const dispatch = useDispatch();

  const uid = useSelector(state => state.user.myid);
  const mydetails = useSelector(state => state.user.mydetails);
  console.log('status', mydetails);
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
        //console.log('cnoPhone', cnoPhone);
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
                  //console.log('User data: ', data);
                }

                for (let key in data) {
                  // console.log(data.phone.slice(3,));
                  let check = cnoDB.current.includes(data.phone.slice(3));
                  if (!check) {
                    console.log('1');
                    cnoDB.current.push(data.phone.slice(3));
                  }
                }
                // console.log('Dddd1', cnoDB.current);
                // console.log('Dddd2', cnoPhone.current);
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
                    let data = querySnapshot.data();
                    if (querySnapshot.data()) {
                      console.log('already in', obj);
                      const item = {
                        id: querySnapshot.id,
                        ...data,
                        created_at: data?.created_at?.toDate(),
                        updated_at: data?.updated_at?.toDate(),
                      };
                      navigation.navigate('ChatMainScreen', {
                        item: item,
                      });
                    } else {
                      firestore()
                        .collection('Channels')
                        .doc(otherUserId + uid)
                        .get()
                        .then(querySnapshot => {
                          let data = querySnapshot.data();
                          if (querySnapshot.data()) {
                            const item = {
                              id: querySnapshot.id,
                              ...data,
                              created_at: data?.created_at?.toDate(),
                              updated_at: data?.updated_at?.toDate(),
                            };
                            navigation.navigate('ChatMainScreen', {
                              item: item,
                            });
                          } else {
                            console.log('creating new channel');

                            let obj1 = {};
                            firestore()
                              .collection('Users')
                              .doc(otherUserId)
                              .get()
                              .then(documentSnapshot => {
                                if (documentSnapshot.exists) {
                                  obj1.name = documentSnapshot.data().name;
                                  obj1.phone = documentSnapshot.data().phone;
                                  obj1.about = documentSnapshot.data().about;
                                  storage()
                                    .ref(`${otherUserId}.jpg`)
                                    .getDownloadURL()
                                    .then(res => {
                                      obj1.profile = res;

                                      channelObj = {
                                        members: [uid, otherUserId],
                                        created_at: new Date(),
                                        updated_at: new Date(),
                                        created_by: uid,
                                        sender_id: '',
                                        receiver_id: '',
                                        seen: false,
                                        deleted_for_all: false,
                                        last_message_type: '',
                                        last_message: '',

                                        message_id: '',
                                        users_details: {
                                          [uid]: {
                                            name: mydetails?.name,
                                            profile: mydetails?.image_url,
                                            phone: mydetails?.phone,
                                            about: mydetails?.about,
                                          },
                                          [otherUserId]: {
                                            name: obj1.name,
                                            profile: obj1.profile,
                                            phone: obj1?.phone,
                                            about: obj1?.about,
                                          },
                                        },
                                      };
                                      console.log('ress', channelObj);
                                      firestore()
                                        .collection('Channels')
                                        .doc(uid + otherUserId)
                                        .set(channelObj)
                                        .then(() => {
                                          console.log('Channel added!');
                                          channelDetails(uid + otherUserId);
                                          // navigation.navigate('Home');
                                        });
                                    });
                                }
                              });
                          }
                        });
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

  const channelDetails = channelID => {
    console.log('channelID', channelID);
    firestore()
      .collection('Channels')
      .doc(channelID)
      .get()
      .then(querySnapshot => {
        let data = querySnapshot.data();
        if (querySnapshot.data()) {
          const item = {
            id: querySnapshot.id,
            ...data,
            created_at: data?.created_at?.toDate(),
            updated_at: data?.updated_at?.toDate(),
          };
          navigation.navigate('ChatMainScreen', {
            item: item,
          });
        }
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
