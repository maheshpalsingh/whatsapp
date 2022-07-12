import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Modal,
} from 'react-native';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import ChatHomeScreen from '../Authorized/ChatHomeScreen/ChatHomeScreen';
import StatusScreen from '../Authorized/StatusScreen/StatusScreen';
import Test from '../Authorized/Test/Test';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
const Tab = createMaterialTopTabNavigator();

export default function HomeScreen({navigation}) {
  const [modalVisible, setModalVisible] = useState(false);
  const totalChat = useSelector(state => state.message.total_read);
  // console.log('aadsdsdsda', totalChat);
  const openModal = () => {
    setModalVisible(!modalVisible);
  };

  const top = useSafeAreaInsets().top;
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#222D36',
          padding: 20,
          paddingTop: top + 5,
        }}>
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
                <Pressable
                  style={{
                    paddingTop: 15,
                  }}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    navigation.navigate('Settings');
                  }}>
                  <Text style={styles.modalText}>Settings</Text>
                </Pressable>
              </View>
            </TouchableOpacity>
          </Modal>
        )}
        <View style={{flex: 1}}>
          <Text style={{color: '#ADACAC', fontSize: 20, fontWeight: 'bold'}}>
            Whatsapp
          </Text>
        </View>

        <TouchableOpacity
          onPress={openModal}
          style={{
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
          }}>
          <Icon name="ellipsis-vertical" color="#ADACAC" size={20} />
        </TouchableOpacity>
      </View>

      {/*// <SafeAreaView style={{flex:1}}>*/}
      <Tab.Navigator
        initialRouteName="Chat"
        screenOptions={{
          tabBarInactiveTintColor: '#ADACAC',
          tabBarActiveTintColor: '#00D789',
          tabBarLabelStyle: {fontSize: 14},
          tabBarStyle: {backgroundColor: '#222D36'},
          tabBarIndicatorStyle: {backgroundColor: '#00D789'},
        }}>
        <Tab.Screen
          name="Camera"
          scrollEnabled
          component={Test}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: () => <Icon name="camera" size={25} color="grey" />,
          }}
        />
        <Tab.Screen
          name="Chat"
          component={ChatHomeScreen}
          options={{
            tabBarLabel: `Chat`,
            tabBarBadge: () =>
              totalChat ? (
                <View
                  key={totalChat + ''}
                  style={{
                    backgroundColor: 'grey',
                    borderRadius: 15,
                    height: 25,
                    width: 25,
                    marginTop: 10,
                    marginRight: 10,
                  }}>
                  <Text
                    style={{
                      color: '#00D789',
                      padding: 4,
                      justifyContent: 'center',
                      textAlign: 'center',
                      fontSize: 15,
                    }}>
                    {totalChat + ''}
                  </Text>
                </View>
              ) : null,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={StatusScreen}
          options={{tabBarLabel: 'Status'}}
        />
      </Tab.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: 'flex-end',
    marginTop: 50,
  },
  modalView: {
    width: '50%',
    justifyContent: 'center',
    //alignItems: 'center',
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
  button: {
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },

  textStyle: {
    color: '#00D789',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 20,
    marginBottom: 15,
    alignSelf: 'flex-start',
    textAlign: 'left',
    color: 'white',
  },
});
