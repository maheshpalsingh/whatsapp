import React from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
const MessageView = ({message, onLongPress}) => {
  const uid = useSelector(state => state.user.token);
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
        },
      ]}
      onLongPress={() => onLongPress(message?.message_id, message?.sender)}>
      {/*<Text> {message.sender}</Text>*/}

      {message.type === 'image' && (
        <Image
          source={{uri: message?.image}}
          style={{width: 200, height: 200}}
        />
      )}
      {!message.deleted_for_all ? (
        <Text style={{fontSize: 16}}> {message?.text}</Text>
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
