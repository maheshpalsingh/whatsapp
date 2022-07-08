import React, {useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {createImageProgress} from 'react-native-image-progress';
import FastImage from 'react-native-fast-image';
import {TextInput} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import {setMyDetails} from '../../../store/actions/users';
import * as ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import storage, {firebase} from '@react-native-firebase/storage';
const Image = createImageProgress(FastImage);
const Profile = ({route}) => {
  const mydetails = useSelector(state => state?.user?.mydetails);

  const [newname, setName] = useState(mydetails?.name);
  const [newabout, setAbout] = useState(mydetails?.about);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [animating, setAnimating] = useState(true);
  const uid = useSelector(state => state.user.myid);
  const dispatch = useDispatch();

  const openModal = () => {
    setModalVisible(!modalVisible);
  };
  const openModal1 = () => {
    console.log('q');
    setModalVisible1(!modalVisible1);
  };

  const updateName = name => {
    console.log('new name', name);
    firestore().collection('Users').doc(uid).set(
      {
        name: newname,
      },
      {merge: true},
    );
    let obj = {...mydetails, name: newname};
    dispatch(setMyDetails(obj));
  };
  const updateAbout = newabout => {
    firestore().collection('Users').doc(uid).set(
      {
        about: newabout,
      },
      {merge: true},
    );
    let obj = {...mydetails, about: newabout};
    dispatch(setMyDetails(obj));
  };

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
                      let obj = {...mydetails, image_url: url};
                      dispatch(setMyDetails(obj));
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

  return (
    <SafeAreaView style={{backgroundColor: '#101D24', flex: 1}}>
      {modalVisible && (
        <Modal
          animationType={false}
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            // Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}>
          <TouchableOpacity
            style={styles.centeredView}
            activeOpacity={1}
            onPressOut={() => setModalVisible(!modalVisible)}>
            <View style={styles.modalView}>
              <Text style={{fontSize: 17, color: '#fff'}}>Enter your name</Text>
              <TextInput
                style={{
                  fontSize: 18,
                  color: '#fff',
                  paddingTop: 20,
                  alignItems: 'center',
                  width: '100%',
                  borderBottomWidth: 2,
                  borderBottomColor: '#00D789',
                  borderRadius: 5,
                  overflow: 'hidden',
                }}
                value={newname}
                onChangeText={text => setName(text)}
                placeholder="Type your name here.."
                placeholderTextColor="#aaaaaa"
                underlineColorAndroid="transparent"
                autoCapitalize="none"
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  marginTop: 10,
                }}>
                <Pressable
                  style={{
                    margin: 20,
                  }}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}>
                  <Text style={styles.modalText}>CANCEL</Text>
                </Pressable>
                <Pressable
                  style={{
                    margin: 20,
                  }}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    updateName(newname);
                  }}>
                  <Text style={styles.modalText}>SAVE</Text>
                </Pressable>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      )}

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
            style={styles.centeredView}
            activeOpacity={1}
            onPressOut={() => setModalVisible(!modalVisible)}>
            <View style={styles.modalView}>
              <Text style={{fontSize: 17, color: '#fff'}}>Enter about you</Text>
              <TextInput
                style={{
                  fontSize: 18,
                  color: '#fff',
                  paddingTop: 20,
                  alignItems: 'center',
                  width: '100%',
                  borderBottomWidth: 2,
                  borderBottomColor: 'green',
                  borderRadius: 5,
                  overflow: 'hidden',
                }}
                value={newabout}
                onChangeText={text => setAbout(text)}
                placeholder="Type your name here.."
                placeholderTextColor="#aaaaaa"
                underlineColorAndroid="transparent"
                autoCapitalize="none"
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  marginTop: 10,
                }}>
                <Pressable
                  style={{
                    margin: 20,
                  }}
                  onPress={() => {
                    setModalVisible1(!modalVisible1);
                  }}>
                  <Text style={styles.modalText}>CANCEL</Text>
                </Pressable>
                <Pressable
                  style={{
                    margin: 20,
                  }}
                  onPress={() => {
                    setModalVisible1(!modalVisible1);
                    updateAbout(newabout);
                  }}>
                  <Text style={styles.modalText}>SAVE</Text>
                </Pressable>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={{
            uri: mydetails?.image_url,
          }}
          indicator={() => {
            return <ActivityIndicator size="large" color="red" />;
          }}
          imageStyle={{
            borderRadius: 100,
          }}
          style={{
            width: 120,
            height: 120,
            marginTop: 50,
          }}
        />
        <TouchableOpacity
          onPress={selectImage}
          style={{
            backgroundColor: '#00D789',
            padding: 5,
            borderRadius: 25,
            position: 'absolute',
            top: 140,
            left: 210,
          }}>
          <Icon name="camera" size={25} color="white" />
        </TouchableOpacity>
      </View>
      <View style={{flexDirection: 'row', paddingTop: 50}}>
        <View
          style={{
            margin: 20,
          }}>
          <Icon name="person" size={25} color="grey" />
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            left: 13,
          }}>
          <Text style={{color: 'grey'}}>Name</Text>
          <Text style={{color: '#fff', fontSize: 19, paddingTop: 5}}>
            {mydetails?.name}
          </Text>
        </View>
        <View
          style={{
            margin: 20,
          }}>
          <Icon name="pencil" size={25} color="#00D789" onPress={openModal} />
        </View>
      </View>
      <View
        style={{
          marginLeft: '20%',
          paddingRight: 10,
          borderBottomWidth: 1,
          paddingBottom: 10,
        }}>
        <Text style={{color: 'grey'}}>
          This is not your username or pin. This name will be visible to your
          WhatsApp contacts.
        </Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <View
          style={{
            margin: 20,
          }}>
          <Icon name="information-circle" size={25} color="grey" />
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            marginLeft: 20,
          }}>
          <Text style={{color: 'grey'}}>About</Text>
          <Text style={{color: '#fff', fontSize: 19, paddingTop: 5}}>
            {mydetails?.about}
          </Text>
        </View>
        <View
          style={{
            margin: 20,
          }}>
          <Icon name="pencil" size={25} color="#00D789" onPress={openModal1} />
        </View>
      </View>
      <View style={{flexDirection: 'row'}}>
        <View
          style={{
            margin: 20,
          }}>
          <Icon name="call" size={25} color="grey" />
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            marginLeft: 20,
            borderTopWidth: 1,
          }}>
          <Text style={{color: 'grey'}}>Phone</Text>
          <Text style={{color: '#fff', fontSize: 19, paddingTop: 5}}>
            {mydetails?.phone}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalView: {
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 20,
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
  modalText: {
    fontSize: 16,
    color: 'white',
  },
});
export default Profile;
