import { fetch } from "react-native/Libraries/Network/fetch";

export const SET_TOKEN = 'SET_TOKEN';
export const SEND_MESSAGE = 'SEND_MESSAGE';

export const setToken = token => {
  return {type: SET_TOKEN, payload: token};
};

// export const sendMessages=(channelid,senderid,text)=>{
//   return dispatch=>{
//     fetch('http://localhost:3000/sendmessages',{
//       method:'POST',
//       headers:{
//         'Content-Type':'application/json'
//       },
//       body:JSON.stringify({channelid,senderid,text})
//     })
//       .then(()=>{console.log('Messages Added')})
//     dispatch({
//       type:SEND_MESSAGE,
//
//     })
//   }
// }


