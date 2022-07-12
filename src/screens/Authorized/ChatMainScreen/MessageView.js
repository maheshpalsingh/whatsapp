import React from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
const MessageView = ({message, onLongPress}) => {
  const uid = useSelector(state => state.user.myid);
  let myid = message.sender === uid;
  // console.log('delete delete', message?.created_at);
  if (message?.deleted_for_me?.includes(uid)) {
    return null;
  }

  return (
    <TouchableOpacity
      style={[
        styles.screen,
        {
          backgroundColor: myid ? '#A0D995' : 'grey',
          alignSelf: myid ? 'flex-end' : 'flex-start',
          marginLeft: !myid && 15,
          marginRight: myid && 15,
        },
      ]}
      onLongPress={() => onLongPress(message?.message_id, message?.sender)}>
      {myid ? (
        <Image
          source={require('../../../assets/imageUI/Vector28.png')}
          style={{height: 10, left: 95, position: 'absolute'}}
        />
      ) : (
        <Image
          source={require('../../../assets/imageUI/Vector27.png')}
          style={{height: 10, left: -5, position: 'absolute'}}
        />
      )}

      {/*<Text> {message.sender}</Text>*/}

      {message.type === 'photo' && (
        <FastImage
          source={{uri: message?.image}}
          style={{width: 200, height: 200}}
        />
      )}
      {!message.deleted_for_all ? (
        <Text style={{fontSize: 16, left: -5}}> {message?.text}</Text>
      ) : (
        <Text>This message was deleted</Text>
      )}
      <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
        <Text style={{alignSelf: 'flex-end'}}>
          {moment(message?.created_at).format('hh:mm A')}
        </Text>
        {!!myid && (
          <Icon
            name="checkmark-done-outline"
            size={20}
            style={{paddingLeft: 5}}
            color={message.seen ? '#3AB0FF' : 'grey'}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    margin: 5,
    maxWidth: '90%',
    borderRadius: 10,
    // width:'70%'
  },
});

export default MessageView;
