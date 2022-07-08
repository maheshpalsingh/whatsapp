import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
import {setMyDetails, setMyID} from '../../../store/actions/users';
import database from '@react-native-firebase/database';
import FastImage from 'react-native-fast-image';
const Settings = ({navigation}) => {
  const uid = useSelector(state => state?.user?.myid);
  const mydetails = useSelector(state => state?.user?.mydetails);

  const dispatch = useDispatch();

  const logout = () => {
    database()
      .ref(`/online/${uid}`)
      .update({
        isActive: false,
        lastSeen: Date(),
      })
      .then(() => {
        console.log('inactive');
        auth()
          .signOut()
          .then(() => {
            dispatch(setMyID(null));
            dispatch(setMyDetails(null));
          });
      });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.profile}
        onPress={() => navigation.navigate('Profile')}>
        <View style={styles.image}>
          <FastImage
            source={{
              // uri: 'data:image/jpeg;base64,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',
              uri: mydetails?.image_url,
            }}
            style={{width: '100%', height: '100%', borderRadius: 50}}
          />
        </View>
        <View style={styles.details}>
          <Text style={styles.name}>{mydetails?.name}</Text>
          <Text style={styles.status}>{mydetails?.about}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.accounts}>
        <View style={styles.icons}>
          <Icon
            name="key"
            size={30}
            color="grey"
            style={{transform: [{rotate: '-43deg'}]}}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.header}>Account</Text>
          <Text style={styles.text}>Privacy,security,change number</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.accounts}>
        <View style={styles.icons}>
          <Icon name="chatbox" size={30} color="grey" />
        </View>
        <View style={styles.section}>
          <Text style={styles.header}>Chats</Text>
          <Text style={styles.text}>ThemeProvider,wallpapers,chat history</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.accounts}>
        <View style={styles.icons}>
          <Icon name="notifications" size={30} color="grey" />
        </View>
        <View style={styles.section}>
          <Text style={styles.header}>Notification</Text>
          <Text style={styles.text}> Message groups & call tones</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.accounts}>
        <View style={styles.icons}>
          <Icon name="cloud-outline" size={30} color="grey" />
        </View>
        <View style={styles.section}>
          <Text style={styles.header}>Storage and data</Text>
          <Text style={styles.text}>Network usage,auto-download</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.accounts}>
        <View style={styles.icons}>
          <Icon name="help-circle-outline" size={30} color="grey" />
        </View>
        <View style={styles.section}>
          <Text style={styles.header}>Help</Text>
          <Text style={styles.text}>
            Help center,contact uss,privacy policy
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.accounts}>
        <View style={styles.icons}>
          <Icon name="people" size={30} color="grey" />
        </View>
        <View style={{alignSelf: 'center', paddingLeft: 10}}>
          <Text style={styles.header}>Invite a friend</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.accounts} onPress={logout}>
        <View style={styles.icons}>
          <Icon name="log-out" size={30} color="grey" />
        </View>
        <View style={{alignSelf: 'center', paddingLeft: 10}}>
          <Text style={styles.header}>Logout</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text style={{color: 'grey', fontSize: 20}}>from </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon
            name="infinite"
            size={20}
            color="#fff"
            style={{paddingRight: 10}}
          />
          <Text style={{color: '#fff', fontSize: 18}}>Meta</Text>
        </View>
      </View>
    </View>
  );
};
export default Settings;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#101D24'},
  profile: {
    //backgroundColor: 'red',
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 0.5,
    height: '12%',
    borderColor: 'grey',
  },
  image: {
    padding: 3,
    //backgroundColor: 'red',
    width: '20%',
    height: '100%',
    //borderRadius: 50,
  },
  details: {
    padding: 10,
    paddingLeft: 20,
  },
  name: {
    color: '#fff',
    fontSize: 20,
  },
  status: {
    paddingTop: 5,
    color: 'grey',
    fontSize: 18,
  },
  icons: {
    //backgroundColor: 'pink',
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  accounts: {
    //backgroundColor: 'red',
    flexDirection: 'row',
    padding: 10,
    paddingVertical: 15,
    // borderBottomWidth: 1,
    // borderColor: 'grey',
  },
  section: {
    paddingLeft: 10,
  },
  header: {
    color: '#fff',
    fontSize: 18,
  },
  text: {
    paddingTop: 5,
    color: 'grey',
    fontSize: 16,
  },
  footer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
