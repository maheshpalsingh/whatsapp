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
