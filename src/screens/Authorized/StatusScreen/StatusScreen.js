import React from 'react';
import {View, Text, Button} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
import {setToken} from '../../../store/actions/users';
import database from '@react-native-firebase/database';
const StatusScreen = () => {
  return (
    <View
      style={{
        backgroundColor: '#101D24',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{color: '#fff'}}>StatusScreen</Text>
    </View>
  );
};

export default StatusScreen;
