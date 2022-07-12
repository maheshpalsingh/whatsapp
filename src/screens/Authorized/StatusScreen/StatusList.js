import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';

const StatusList = ({status, name, onPress}) => {
  return (
    <TouchableOpacity
      style={{padding: 10, paddingHorizontal: 15, flexDirection: 'row'}}
      onPress={onPress}>
      <View
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          overflow: 'hidden',
          alignchannelDetails: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: 'pink',
        }}>
        <FastImage
          source={{
            uri: status,
          }}
          style={{width: '100%', height: '100%'}}
        />
      </View>
      <View style={{flex: 1, justifyContent: 'center', paddingLeft: 20}}>
        <Text style={{color: '#fff', fontSize: 20}}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default StatusList;
