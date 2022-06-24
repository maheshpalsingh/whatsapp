import React, {useState} from 'react';
import {
  Alert,
  Image,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import auth from '@react-native-firebase/auth';
import '@react-native-firebase/app';
// import firestore from '@react-native-firebase/firestore';
// import storage, {firebase} from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import * as ImagePicker from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';

export default function RegistrationScreen({navigation, route}) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // const [image, setImage] = useState(null);
  // const [uploading, setUploading] = useState(false);
  // const [transferred, setTransferred] = useState(0);

  const onFooterLinkPress = () => {
    navigation.navigate('Login');
  };
  const onRegisterPress = props => {
    const uid = route?.params?.uid;
    console.log('=========', uid);
    // auth()
    //   .createUserWithEmailAndPassword(email, password)
    //   .then((userdata) => {
    //     console.log('User account created!');
    //     const uid=userdata.user.uid
    database()
      .ref(`/users/${uid}`)
      .set({
        email: email,
        name: fullName,
      })
      .then(() => console.log('Data set.'));
    //})
    //.catch(e=>{console.log(e);})
  };

  // const onRegisterPress = async () => {
  //   auth()
  //     .createUserWithEmailAndPassword(email, password)
  //     .then(userdata => {
  //       console.log('User account created & signed in!');
  //       const uid = userdata.user.uid;
  //       firestore()
  //         .collection('Users')
  //         .doc(uid)
  //         .set(
  //           {
  //             email,
  //             name: fullName,
  //             // image: ' ',
  //           },
  //           {merge: true},
  //         )
  //         .then(() => {
  //           console.log('User added!');
  //           onFooterLinkPress();
  //         })
  //         .catch(e => {
  //           console.log(e);
  //         });
  //     })
  //     .catch(error => {
  //       if (error.code === 'auth/email-already-in-use') {
  //         console.log('That email address is already in use!');
  //       }
  //       if (error.code === 'auth/invalid-email') {
  //         console.log('That email address is invalid!');
  //       }
  //       console.error(error);
  //     });
  // };

  // const selectImage = async () => {
  //   const options = {
  //     maxWidth: 2000,
  //     maxHeight: 2000,
  //     storageOptions: {
  //       skipBackup: true,
  //       path: 'images',
  //     },
  //   };
  //   await ImagePicker.launchImageLibrary(options, response => {
  //     debugger;
  //     console.log('Response = ', response);
  //
  //     if (response.didCancel) {
  //       console.log('User cancelled image picker');
  //     } else if (response?.error) {
  //       console.log('ImagePicker Error: ', response.error);
  //     } else if (response?.customButton) {
  //       console.log('User tapped custom button: ', response.customButton);
  //       alert(response.customButton);
  //     } else {
  //       debugger;
  //       const source = response.assets[0].uri;
  //       debugger;
  //       console.log('response==== launch Image', source);
  //       setImage(source);
  //       const result = email.split('@')[0];
  //       const ref = storage().ref(`${result}.jpg`).putFile(source, {
  //         cacheControl: 'no-store', // disable caching
  //       });
  //       ref.on(
  //         firebase.storage.TaskEvent.STATE_CHANGED,
  //         snapshot => {
  //           debugger;
  //           let progress = snapshot.bytesTransferred / snapshot.totalBytes;
  //           console.log('Uploading: ', progress);
  //           // this.props.updateSelfiePic(null);
  //           // this.setState({profilePicUploadProgress: 0.002 + progress});
  //         },
  //         error => {
  //           debugger;
  //           console.log(error);
  //           // sentry.captureMessage('Error uploading selfie', error.message);
  //         },
  //       );
  //       //End up upload
  //       ref
  //         .then(() => {
  //           debugger;
  //           console.log('Success');
  //           //Save URL to Firestore
  //           const picRef = storage().ref(`${email}.jpg`);
  //           picRef
  //             .getDownloadURL()
  //             .then(url => {
  //               console.log(url);
  //               if (url) {
  //                 debugger;
  //                 console.log('=========download url===========', url);
  //                 setImage(url);
  //                 // dispatch(UploadProfilePic({profilePic: url}, user._id));
  //                 debugger;
  //               }
  //             })
  //             .catch(error => {
  //               console.log('Error getting image 1: ', error.message);
  //             });
  //         })
  //         .catch(error => {
  //           console.log('error in catch', error);
  //         });
  //     }
  //   });
  // };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{flex: 1, width: '100%'}}
        keyboardShouldPersistTaps="always">
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#aaaaaa"
          onChangeText={text => setFullName(text)}
          value={fullName}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#aaaaaa"
          onChangeText={text => setEmail(text)}
          value={email}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#aaaaaa"
          secureTextEntry
          placeholder="Password"
          onChangeText={text => setPassword(text)}
          value={password}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#aaaaaa"
          secureTextEntry
          placeholder="Confirm Password"
          onChangeText={text => setConfirmPassword(text)}
          value={confirmPassword}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />

        {/*<Image source={{uri: image}} style={{height: 50, width: 50}} />*/}
        {/*<TouchableOpacity style={styles.uploadButton} onPress={selectImage}>*/}
        {/*  <Text style={styles.buttonText}>Upload image</Text>*/}
        {/*</TouchableOpacity>*/}
        <TouchableOpacity
          style={styles.button}
          onPress={() => onRegisterPress()}>
          <Text style={styles.buttonTitle}>Create account</Text>
        </TouchableOpacity>
        <View style={styles.footerView}>
          <Text style={styles.footerText}>
            Already got an account?{' '}
            <Text onPress={onFooterLinkPress} style={styles.footerLink}>
              Log in
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
