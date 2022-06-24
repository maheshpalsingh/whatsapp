import React from "react";
import { View,Text ,Button} from "react-native";
 import Icons from 'react-native-vector-icons/Ionicons'
import auth from "@react-native-firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../../../store/actions/users";
import database from "@react-native-firebase/database";
const StatusScreen = () => {
  const uid = useSelector(state => state.user.token);
  const dispatch= useDispatch()
  // dispatch(setToken(null));
  const logout = () => {

    database()
      .ref(`/online/${uid}`)
      .update({
        isActive: false,
        lastSeen:Date()
      })
      .then(() => {
        console.log('inactive')
        auth()
          .signOut()
          .then(() => {
            dispatch(setToken(null));
          });
      });


  };
  return (
    <View style={{backgroundColor:'#101D24',flex:1}}>
      <Text>StatusScreen</Text>
<Button title='logout' onPress={logout} />
      <Icons name="search-outline" size={30} color="#900" />
    </View>
  );
};

export default StatusScreen;
