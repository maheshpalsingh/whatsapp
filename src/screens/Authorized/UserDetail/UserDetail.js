import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import FastImage from 'react-native-fast-image';

const UserDetail = ({route, navigation}) => {
  const id = route?.params?.recieverid;
  const profile = route?.params?.recieverProfile;
  const name = route?.params?.recieverName;
  const phone = route?.params?.recieverPhone;
  const about = route?.params?.recieverStatus;
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const borderColor = '#0e1111';
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#101D24'}}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={{flex: 1}}>
        <View style={{flexDirection: 'row', height: '18%'}}>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              marginHorizontal: 10,
            }}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back-outline" size={30} color="#fff" />
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                flex: 1,
                width: '40%',
                borderRadius: 200,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <FastImage
                source={{
                  uri: profile,
                }}
                style={{width: '100%', height: '100%', borderRadius: 60}}
              />
            </View>
          </View>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              marginHorizontal: 10,
            }}
            onPress={() => navigation.goBack()}>
            <Icon name="ellipsis-vertical" size={25} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={{alignSelf: 'center', marginVertical: 10}}>
          <Text style={{color: '#fff', fontSize: 22, textAlign: 'center'}}>
            {name}
          </Text>
          <Text style={{color: 'grey', fontSize: 18, paddingTop: 5}}>
            {phone}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: 20,
          }}>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              marginHorizontal: 10,
            }}
            onPress={() => navigation.goBack()}>
            <Icon name="call" size={30} color="#00D789" style={{padding: 10}} />
            <Text style={{fontSize: 18, color: '#00D789'}}>Audio</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              alignItems: 'center',

              marginHorizontal: 10,
            }}
            onPress={() => navigation.goBack()}>
            <Icon
              name="videocam"
              size={30}
              color="#00D789"
              style={{padding: 10}}
            />
            <Text style={{fontSize: 18, color: '#00D789'}}>Video</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              marginHorizontal: 10,
            }}
            onPress={() => navigation.goBack()}>
            <Icon
              name="search"
              size={30}
              color="#00D789"
              style={{padding: 10}}
            />
            <Text style={{fontSize: 18, color: '#00D789'}}>Search</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              marginHorizontal: 10,
            }}
            onPress={() => navigation.goBack()}>
            <Icon
              name="wallet"
              size={30}
              color="#00D789"
              style={{padding: 10}}
            />
            <Text style={{fontSize: 18, color: '#00D789'}}>Pay</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            borderTopWidth: 10,
            borderBottomWidth: 10,
            borderColor: borderColor,
          }}>
          <Text
            style={{
              padding: 20,
              color: '#fff',
              fontWeight: '500',
              fontSize: 16,
            }}>
            {about || 'Hey there! I am using WhatsApp.'}
          </Text>
        </View>
        <View style={{borderBottomWidth: 10, borderColor}}>
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon
              name="notifications"
              size={30}
              color="#00D789"
              style={styles.icon}
            />
            <Text style={{color: '#fff', fontSize: 16, flex: 1}}>
              Mute notifications
            </Text>
            <Switch
              trackColor={{false: '#767577', true: '#abf7b1'}}
              thumbColor={isEnabled ? '#00D789' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
              style={{marginRight: 20}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon
              name="musical-note"
              size={30}
              color="#00D789"
              style={styles.icon}
            />
            <Text style={{color: '#fff', fontSize: 16}}>
              Custom notifications
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="image" size={30} color="#00D789" style={styles.icon} />
            <Text style={{color: '#fff', fontSize: 16}}>Media visibility</Text>
          </TouchableOpacity>
        </View>
        <View style={{borderBottomWidth: 10, borderColor}}>
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon
              name="lock-closed"
              size={30}
              color="#00D789"
              style={styles.icon}
            />
            <Text style={{color: '#fff', fontSize: 16}}>Encrytion</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="timer" size={30} color="#00D789" style={styles.icon} />
            <Text style={{color: '#fff', fontSize: 16}}>
              Disappearing messages
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{borderBottomWidth: 10, borderColor}}>
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon
              name="lock-closed"
              size={30}
              color="red"
              style={styles.icon}
            />
            <Text style={{color: 'red', fontSize: 16}}>Block {name}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="timer" size={30} color="red" style={styles.icon} />
            <Text style={{color: 'red', fontSize: 16}}>Report {name}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  icon: {
    padding: 10,
    marginHorizontal: 20,
  },
});

export default UserDetail;
