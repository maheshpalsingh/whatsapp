import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  AppState,
  StatusBar,
} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';

import ChatView from './ChatView';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import {useDispatch, useSelector} from 'react-redux';
import storage, {firebase} from '@react-native-firebase/storage';
import {setToken} from '../../../store/actions/users';
import * as messageActions from '../../../store/actions/messages';

const ChatHomeScreen = ({navigation}) => {
  const [channelDetails, setChannelDetails] = useState([]);
  const tmpUsers = useRef([]);
  const [channelID, setchannelID] = useState();
  const [userStatus, setStatus] = useState(false);
  const [userLastSeen, setLastSeen] = useState(false);
  const [lastmessage, setLastMessage] = useState([]);
  const [myFCM, setFCM] = useState();
  const getLastMessage = useSelector(
    state => state?.message?.lastmessage[channelID],
  );
  const uid = useSelector(state => state.user.token);
  const dispatch = useDispatch();

  // console.log('kkkk', getLastMessage);
  const lastMessage = getLastMessage || [];

  //fcm token
  useEffect(() => {
    firestore()
      .collection('Users')
      .doc(uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          firebase
            .messaging()
            .getToken(firebase.app().options.messagingSenderId)
            .then(x => {
              // console.log(x)
              if (documentSnapshot.data().fcm) {
                let check = documentSnapshot.data().fcm.includes(x);
                if (!check) {
                  if (documentSnapshot.data().fcm.length === 3) {
                    let final = documentSnapshot.data().fcm.slice(-2).concat(x);
                    firestore()
                      .collection('Users')
                      .doc(uid)
                      .set({fcm: final}, {merge: true})
                      .then(() => {});
                  } else {
                    let final = documentSnapshot.data().fcm.concat(x);
                    firestore()
                      .collection('Users')
                      .doc(uid)
                      .set({fcm: final}, {merge: true})
                      .then(() => {});
                  }
                }
              } else {
                console.log('setting fcm');
                firestore()
                  .collection('Users')
                  .doc(uid)
                  .set({fcm: [x]}, {merge: true})
                  .then(() => {});
              }
            })
            .catch(e => console.log(e));
        }
      });
  }, [uid]);

  //app state
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      const reference = database().ref(`/online/${uid}`);
      if (nextAppState === 'active') {
        //console.log("online");
        reference
          .update({
            isActive: true,
          })
          .then(() => console.log('active'));
      } else {
        //console.log("offline");
        reference
          .update({
            isActive: false,
            lastSeen: Date(),
          })
          .then(() => console.log('inactive'));
      }
      reference
        .onDisconnect()
        .update({
          isActive: false,
          lastSeen: Date(),
        })
        .then(() => console.log('On disconnect function configured.'));
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
      .collection('Channels')
      .where('members', 'array-contains-any', [uid])
      .onSnapshot(documentSnapshot => {
        if (!documentSnapshot?.empty) {
          const temp = [];
          documentSnapshot?.docs.forEach(doc => {
            const data = doc.data();

            const obj = {
              id: doc.id,
              ...data,
              created_at: data?.created_at?.toDate(),
              updated_at: data?.updated_at?.toDate(),
            };
            temp.push(obj);
          });

          if (temp.length) {
            setChannelDetails(temp);
          }
        }
      });
  }, []);

  const startConversation = () => {
    navigation.navigate('ContactScreen');
  };

  const keyExtractor = (item, idx) => {
    // console.log(item);
    return item?.recordID?.toString() || idx.toString();
  };
  const renderItem = ({item, index}) => {
    //console.log('items', item);
    return (
      <ChatView
        contact={item}
        onPress={() => {
          // navigation.navigate("ChatMainScreen", { item, channelID,userLastSeen,userStatus });
          navigation.navigate('ChatMainScreen', {
            item: {
              ...item,
              created_at: item.created_at.toString(),
              updated_at: item.updated_at.toString(),
            },
          });
        }}
      />
    );
  };

  return (
    <View style={{backgroundColor: '#101D24', flexGrow: 1}}>
      <StatusBar barStyle="light-content" backgroundColor="#101D24" />
      {channelDetails.length !== 0 && (
        <FlatList
          data={channelDetails}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          style={{flex: 1}}
        />
      )}

      <View
        style={{
          width: 80,
          height: 80,
          position: 'absolute',
          bottom: 50,
          right: 30,
        }}>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: '#00D789',
            height: '100%',
            borderRadius: 100,
            justifyContent: 'center',
          }}
          onPress={startConversation}>
          <Image
            source={require('../../../assets/imageUI/mdi_android-messages.png')}
            style={{alignSelf: 'center'}}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatHomeScreen;
