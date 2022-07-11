import React, {useEffect, useState} from 'react';
import {Text, View, TouchableOpacity, TextInput} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {setMyDetails, setMyID} from '../../store/actions/users';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import * as ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import storage, {firebase} from '@react-native-firebase/storage';
import FastImage from 'react-native-fast-image';

const AddDetails = ({route}) => {
  const navigation = useNavigation();
  const cno = route?.params?.cno;
  const uid = route?.params?.uid;
  console.log('cno', cno, uid);
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [url, seturl] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    firestore()
      .collection('Users')
      .doc(uid)
      .get()
      .then(documentSnapshot => {
        console.log('User exists: ', documentSnapshot.exists);
        if (documentSnapshot.exists) {
          const data = documentSnapshot.data();
          console.log('User data: ', data);
          setName(data?.name);
          setAbout(data?.about);
          storage()
            .ref(`${uid}.jpg`)
            .getDownloadURL()
            .then(res => {
              console.log('get', res);
              seturl(res);
            });
        }
      });
  }, [uid]);

  const imageUpdate = () => {
    storage()
      .ref(`${uid}.jpg`)
      .getDownloadURL()
      .then(res => {
        seturl(res);

        console.log('1');
      })
      .catch(e => {
        console.log('error', e);
      });
  };

  const addDetails = () => {
    console.log('Adding Details');
    firestore()
      .collection('Users')
      .doc(uid)
      .set(
        {
          name: name,
          phone: cno,
          about: about,
        },
        {merge: true},
      )
      .then(() => {
        console.log('FUser added!');
        database()
          .ref(`/online/${uid}`)
          .set({
            isActive: true,
            lastSeen: Date(),
          })
          .then(() => console.log('RData set.'));

        dispatch(setMyID(uid));
        let obj = {};
        obj.name = name;
        obj.image_url = url;
        obj.phone = cno;
        obj.about = about;
        dispatch(setMyDetails(obj));
      })
      .catch(e => {
        console.log(e);
      });
  };

  const selectImage = async () => {
    const options = {
      maxWidth: 2000,
      maxHeight: 2000,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    await ImagePicker.launchImageLibrary(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response?.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response?.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const source = response.assets[0].uri;
        console.log('response==== launch Image', source);

        ImageResizer.createResizedImage(
          source,
          100,
          100,
          'JPEG',
          100,
          0,
          'pictures',
        )
          .then(response => {
            console.log(response.size);
            const ref = storage().ref(`${uid}.jpg`).putFile(response.uri, {
              cacheControl: 'no-store', // disable caching
            });
            ref.on(
              firebase.storage.TaskEvent.STATE_CHANGED,
              snapshot => {
                let progress = snapshot.bytesTransferred / snapshot.totalBytes;
                console.log('Uploading: ', progress);
              },
              error => {
                console.log('imageerr', error);
              },
            );
            //End up upload
            ref
              .then(() => {
                console.log('Success');
                const picRef = storage().ref(`${uid}.jpg`);
                picRef
                  .getDownloadURL()
                  .then(url => {
                    console.log(url);
                    if (url) {
                      debugger;
                      console.log('=========download url===========', url);
                      imageUpdate();
                    }
                  })
                  .catch(error => {
                    console.log('Error getting image 1: ', error.message);
                  });
              })
              .catch(error => {
                console.log('error in catch', error);
              });
          })
          .catch(err => {
            console.log(err);
          });

        // const result = email.split('@')[0];
      }
    });
  };
  const imagetext = url ? 'Update image' : 'Select image';
  return (
    <View style={{backgroundColor: '#fff', flex: 1}}>
      <View style={{marginTop: 60, alignItems: 'center'}}>
        <Text style={{fontSize: 20, color: 'green'}}>Profile Info</Text>
      </View>
      <View style={{marginTop: 20, alignItems: 'center'}}>
        <Text style={{fontSize: 16, marginHorizontal: 10, color: 'grey'}}>
          Please provide your name and an optional profile
        </Text>
        <Text style={{fontSize: 16, color: 'grey'}}>photo</Text>
      </View>
      <View
        style={{
          marginTop: 50,
          marginLeft: 120,
          borderRadius: 100,
          backgroundColor: 'grey',
          alignItems: 'center',
          justifyContent: 'center',
          height: '18%',
          width: '40%',
        }}>
        <FastImage
          source={{uri: url}}
          style={{flex: 1, width: '100%', height: '100%', borderRadius: 100}}
        />
        <TouchableOpacity style={{position: 'absolute'}} onPress={selectImage}>
          <Text>{imagetext} </Text>
        </TouchableOpacity>
      </View>
      <View style={{alignItems: 'center'}}>
        <TextInput
          style={{
            alignItems: 'center',
            width: '80%',
            borderBottomWidth: 1,
            borderBottomColor: 'green',
            backgroundColor: 'white',
            marginTop: 20,
            marginBottom: 10,
            marginLeft: 45,
            marginRight: 30,
            paddingLeft: 16,
            height: 48,
            borderRadius: 5,
            overflow: 'hidden',
          }}
          value={name}
          onChangeText={text => setName(text)}
          placeholder="Type your name here.."
          placeholderTextColor="#aaaaaa"
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={{
            alignItems: 'center',
            width: '80%',
            borderBottomWidth: 1,
            borderBottomColor: 'green',
            backgroundColor: 'white',
            marginTop: 20,
            marginBottom: 10,
            marginLeft: 45,
            marginRight: 30,
            paddingLeft: 16,
            height: 48,
            borderRadius: 5,
            overflow: 'hidden',
          }}
          value={about}
          onChangeText={text => setAbout(text)}
          placeholder="Type about you here.."
          placeholderTextColor="#aaaaaa"
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={{
            marginTop: 100,
            alignItems: 'center',
            borderRadius: 5,
            width: '20%',
            backgroundColor: 'green',
            padding: 10,
          }}
          onPress={addDetails}>
          <Text style={{color: '#fff'}}>NEXT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default AddDetails;
