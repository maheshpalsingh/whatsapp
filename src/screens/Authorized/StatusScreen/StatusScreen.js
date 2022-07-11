import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';

import { useSelector} from 'react-redux';

import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import {createImageProgress} from 'react-native-image-progress';
import * as ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import storage, {firebase} from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

const StatusScreen = ({navigation}) => {
  const Image = createImageProgress(FastImage);
  const mydetails = useSelector(state => state?.user?.mydetails);

  const [animating, setAnimating] = useState(true);
  const [demoImage, setDemoImage] = useState();
  const uid = useSelector(state => state.user.myid);

  const selectImage = async () => {
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
            const ref = storage()
              .ref(`status/${uid}.jpg`)
              .putFile(response.uri, {
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
                const picRef = storage().ref(`status/${uid}.jpg`);
                picRef
                  .getDownloadURL()
                  .then(url => {
                    console.log(url);
                    if (url) {
                      firestore().collection('Status').doc(uid).set(
                        {
                          status: url,
                          type: 'image',
                          created_at: new Date(),
                          seen: false,
                        },
                        {merge: true},
                      );
                    }

                    setTimeout(() => {
                      setAnimating(false);
                    }, 1000);
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

  useEffect(() => {
    firestore()
      .collection('Users')
      .doc(uid)
      .get()
      .then(d => setDemoImage(d.data()?.status));
  }, []);

  return (
    <ScrollView style={{backgroundColor: '#101D24'}}>
      <TouchableOpacity
        onPress={selectImage}
        style={{
          flexDirection: 'row',
          backgroundColor: '#101D24',
          padding: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: 50,
            height: 50,
            borderRadius: 25,
            overflow: 'hidden',
            //backgroundColor: '#101D24',
            alignchannelDetails: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: 'pink',
          }}>
          <FastImage
            source={{
              uri: mydetails?.image_url,
            }}
            style={{width: '100%', height: '100%'}}
          />
        </View>
        <View
          style={{
            backgroundColor: '#00D789',
            alignSelf: 'baseline',
            borderRadius: 10,
            top: 40,
            left: 45,
            position: 'absolute',
          }}>
          <Icon name="add" size={18} color="#fff" />
        </View>

        <View style={{flex: 1, justifyContent: 'center', paddingLeft: 20}}>
          <Text style={{color: '#fff', fontSize: 20}}>My status</Text>
          <Text style={{color: 'grey', fontSize: 18, lineHeight: 22}}>
            Tap to add status update
          </Text>
        </View>
      </TouchableOpacity>
      <View style={{backgroundColor: '#101D24'}}>
        <Text style={{color: '#fff', fontSize: 20, paddingLeft: 10}}>
          Recent updates
        </Text>
        <TouchableOpacity
          style={{padding: 15, flexDirection: 'row'}}
          onPress={() => navigation.navigate('StatusUI', {demoImage})}>
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              overflow: 'hidden',
              //backgroundColor: '#101D24',
              alignchannelDetails: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: 'pink',
            }}>
            <FastImage
              source={{
                uri: demoImage,
              }}
              style={{width: '100%', height: '100%'}}
            />
          </View>
          <View style={{flex: 1, justifyContent: 'center', paddingLeft: 20}}>
            <Text style={{color: '#fff', fontSize: 20}}>My status</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default StatusScreen;
