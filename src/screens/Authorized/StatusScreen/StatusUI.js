import React from 'react';
import {View, Text} from 'react-native';
import FastImage from 'react-native-fast-image';

const StatusUI = ({route, navigation}) => {
  const statusImage = route?.params?.demoImage;
  //console.log('123', statusImage);
  setTimeout(() => {
    navigation.goBack();
  }, 3000);
  return (
    <FastImage
      source={{
        uri: statusImage,
      }}
      style={{width: '100%', height: '100%'}}
    />
  );
};

export default StatusUI;
