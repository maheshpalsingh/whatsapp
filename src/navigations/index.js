import React, {useEffect, useState, useRef} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  LoginScreen,
  HomeScreen,
  AddDetails,
  Screen1,
  Screen2,
  Settings,
  UserDetail,
} from '../screens/index';
import {useDispatch, useSelector, Provider} from 'react-redux';
import {SafeAreaView} from 'react-native';
import ContactScreen from '../screens/ContactScreen/ContactScreen';
import ChatMainScreen from '../screens/Authorized/ChatMainScreen/ChatMainScreen';
import SelectImage from '../screens/Authorized/SelectImage/SelectImage';
import messaging from '@react-native-firebase/messaging';
import storage from '@react-native-firebase/storage';

const Stack = createStackNavigator();
const NavIndex = () => {
  const user = useSelector(state => state.user.token);
  const navigationRef = useRef();
  const handleNotification = (obj, channelID) => {
    // console.log('ooooo',obj,channelID);
    navigationRef.current?.navigate('ChatMainScreen', {channelID, item: obj});
  };
  const getNotification = async () => {
    const remoteMessage = await messaging().getInitialNotification();
    // console.log('RRR',remoteMessage);
    let rM = remoteMessage?.data;
    // console.log('RRR',rM);
    if (rM) {
      let channelID = rM.channelID;
      let image = rM.recieverid + '.jpg';
      let obj = {};
      obj.id = rM.recieverid;
      obj.name = rM.contactName;
      obj.phone = rM.contactNumber;

      storage()
        .ref(image)
        .getDownloadURL()
        .then(res => {
          obj.image = res;
          handleNotification(obj, channelID);
        })
        .catch(e => {
          console.log('error', e);
        });
    }
  };
  const onReady = () => {
    getNotification();
  };
  return (
    <NavigationContainer onReady={onReady} ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{headerStyle: {backgroundColor: '#222D36'}}}>
        {user ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ChatMainScreen"
              component={ChatMainScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="SelectImage"
              component={SelectImage}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ContactScreen"
              component={ContactScreen}
              options={{
                title: 'Select contact',
                headerTitleStyle: {color: '#fff'},
              }}
            />
            <Stack.Screen
              name="Settings"
              component={Settings}
              options={{
                title: 'Settings',
                headerTitleStyle: {color: '#fff'},
                //headerStyle: {},
              }}
            />
            <Stack.Screen
              name="UserDetail"
              component={UserDetail}
              options={{headerShown: false}}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Screen1"
              component={Screen1}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Screen2"
              component={Screen2}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="AddDetails"
              component={AddDetails}
              options={{headerShown: false}}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default NavIndex;
