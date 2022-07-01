import React, {useEffect} from 'react';
import {Text, View} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const UserDetail = ({route}) => {
  const id = route?.params?.recieverid;
  console.log(id, 'id');
  useEffect(() => {
    firestore()
      .collection('Users')
      .doc(id)
      .get()
      .then(documentSnapshot => {
        console.log('User exists: ', documentSnapshot.exists);
        if (documentSnapshot.exists) {
          console.log('User data: ', documentSnapshot.data());

          storage()
            .ref(`${id}.jpg`)
            .getDownloadURL()
            .then(res => {
              console.log('get', res, documentSnapshot.data());
            });
        }
      });
  }, [id]);
  return (
    <View>
        
      <Text>dddddddd</Text>
    </View>
  );
};

export default UserDetail;
