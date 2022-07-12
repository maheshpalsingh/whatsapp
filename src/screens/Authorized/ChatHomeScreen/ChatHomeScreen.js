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

import ChatView from './ChatView';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import {useDispatch, useSelector} from 'react-redux';
import {firebase} from '@react-native-firebase/storage';
import * as messageActions from '../../../store/actions/messages';

const ChatHomeScreen = ({navigation}) => {
  const channelDetails = useSelector(state => state.message.channelDetails);
  const seenCount = useRef(0);
  const [channelID, setchannelID] = useState();
  const getLastMessage = useSelector(
    state => state?.message?.lastmessage[channelID],
  );
  //console.log('channelDetails;kjjjjj', channelDetails);

  const uid = useSelector(state => state.user.myid);
  const dispatch = useDispatch();
  // const getChannelDetails = async () => {
  //   dispatch(messageActions.readChannelDetails(channelDetails?.id));
  // };
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

  //getting channels
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('Channels')
      //.orderBy('updated_at', 'desc')
      .where('members', 'array-contains-any', [uid])
      .onSnapshot(documentSnapshot => {
        //console.log('dddddðð');
        if (!documentSnapshot?.empty) {
          const temp = [];
          let a = 0;
          documentSnapshot?.docs.forEach(doc => {
            const data = doc.data();
            //console.log('ddaattaa', data.read_count, doc.id);

            if (data.read_count > 0 && data.sender_id !== uid) {
              a++;
            }

            const obj = {
              id: doc.id,
              ...data,
              totalseenLeft: a,
              seenLeft: seenCount.current,
              created_at: data?.created_at?.toDate(),
              updated_at: data?.updated_at?.toDate(),
            };

            temp.push(obj);
          });

          if (temp.length) {
            dispatch(
              messageActions.readChannelDetails(
                temp.sort((a, b) => {
                  return b.updated_at - a.updated_at;
                }),
              ),
            );
          }
          //console.log('111', a);
          // console.log('aaa', a);
          dispatch(messageActions.setTotatChat(a));
        }
      });
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  const startConversation = () => {
    navigation.navigate('ContactScreen');
  };

  const keyExtractor = (item, idx) => {
    //console.log(item);
    return item?.recordID?.toString() || idx.toString();
  };
  const renderItem = ({item, index}) => {
    //console.log('items', item);
    return (
      <ChatView
        contact={item}
        onPress={() => {
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
      {channelDetails?.length !== 0 && (
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
