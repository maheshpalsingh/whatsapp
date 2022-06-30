import firestore from '@react-native-firebase/firestore';

export const READ_MESSAGE = 'READ_MESSAGE';
export const READ_LASTMESSAGE = 'READ_LASTMESSAGE';
export const SEND_MESSAGE = 'SEND_MESSAGE';

export const readAllMessages = channelID => {
  return async dispatch => {
    try {
      firestore()
        .collection('Channels')
        .doc(channelID)
        .collection('messages')
        .orderBy('created_at', 'desc')
        .limit(100)
        .get()
        .then(documentSnapshot => {
          const temp = [];
          if (documentSnapshot) {
            documentSnapshot.docs.forEach(doc => {
              const data = doc.data();
              let create_at = data.created_at.toDate();
              let updated_at = data.updated_at.toDate();
              let obj1 = {
                ...data,
                created_at: create_at,
                updated_at: updated_at,
                message_id: doc.id,
              };
              temp.push(obj1);
            });
          }
          dispatch({
            type: READ_MESSAGE,
            payload: {[channelID]: temp},
          });
        });
    } catch (e) {
      console.log('Error while fetching messages', e);
    }
  };
};

export const readNewMessage = (channelID, lastVisible) => {
  return async (dispatch, getState) => {
    try {
      const prevMessages = getState().message.messages[channelID] || [];
      let allmessages = [];
      firestore()
        .collection('Channels')
        .doc(channelID)
        .collection('messages')
        .where('updated_at', '>', new Date(lastVisible))
        .limit(100)
        .get()
        .then(documentSnapshot => {
          const temp = [];

          if (!documentSnapshot.empty) {
            allmessages = [...prevMessages];
            documentSnapshot.docs.forEach(doc => {
              const data = doc.data();
              const messageId = doc.id;
              let create_at = data?.created_at?.toDate();
              let updated_at = data?.updated_at?.toDate();

              const matchIndex = prevMessages.findIndex(
                item => item.message_id === messageId,
              );

              if (matchIndex >= 0) {
                const allmessages = [...prevMessages];
                let obj1 = {
                  ...data,
                  created_at: create_at,
                  updated_at: updated_at,
                  message_id: messageId,
                };
                allmessages[matchIndex] = obj1;
              } else {
                let obj1 = {
                  ...data,
                  created_at: create_at,
                  updated_at: updated_at,
                  message_id: doc.id,
                };
                temp.push(obj1);
              }
            });
          }

          if (temp.length > 0 || allmessages.length > 0) {
            dispatch({
              type: READ_MESSAGE,
              payload: {[channelID]: [...temp, ...allmessages]},
            });
          }
        });
    } catch (e) {}
  };
};

export const readLastMessage = channelID => {
  return async dispatch => {
    try {
      firestore()
        .collection('Channels')
        .doc(channelID)
        .onSnapshot(documentSnapshot => {
          if (documentSnapshot) {
            const data = documentSnapshot.data();
            //console.log('dtdt', data);
            dispatch({
              type: READ_LASTMESSAGE,
              payload: {[channelID]: data},
            });
          }
        });
    } catch (e) {
      console.log(e);
    }
  };
};

// export const sendMessage=(channelID,newMessage,uid)=>{
//   return async (dispatch,getState) => {
//     try {
//       const prevMessages= getState().message.messages[channelID] || []
//       firestore()
//         .collection("Channels")
//         .doc(channelID)
//         .collection("messages")
//         .doc()
//         .set(
//           {
//             type: "text",
//             sender: uid,
//             text: newMessage,
//             created_at: new Date(),
//             seen: false,
//           },
//           { merge: true },
//         )
//         .then(documentSnapshot => {
//           const temp = [];
//
//           if (documentSnapshot) {
//             documentSnapshot.docs.forEach(doc => {
//               const data= doc.data()
//               let date=data.created_at.toDate()
//               let obj1={...data,created_at:date,message_id:doc.id}
//               temp.push(obj1);
//             });
//           }
//           if(temp.length>0)
//           {
//             dispatch({
//               type: SEND_MESSAGE,
//               payload: {[channelID]:[...prevMessages,...temp]},
//             });
//           }
//
//         });
//     } catch (e) {
//       console.log('Error while fetching messages', e);
//     }
//   };
// }
