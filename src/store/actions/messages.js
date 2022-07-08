import firestore from '@react-native-firebase/firestore';

export const READ_MESSAGE = 'READ_MESSAGE';
export const READ_LASTMESSAGE = 'READ_LASTMESSAGE';
export const READ_CHANNEL_DETAILS = 'READ_CHANNEL_DETAILS';

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
              // console.log('1q', data);
              const messageId = doc.id;
              let create_at = data?.created_at?.toDate();
              let updated_at = data?.updated_at?.toDate();

              const matchIndex = prevMessages.findIndex(
                item => item.message_id === messageId,
              );
              // console.log('index', matchIndex);
              if (matchIndex >= 0) {
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
                  message_id: messageId,
                };

                temp.push(obj1);
                // console.log('temp2', temp);
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

export const readChannelDetails = details => {
  return {type: READ_CHANNEL_DETAILS, payload: details};
};

export const readLastMessage = channelID => {
  return async (dispatch, getState) => {
    const myid = getState();
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

// export const readChannelDetails = channelID => {
//   return async dispatch => {
//     try {
//       firestore()
//         .collection('Channels')
//         .where('members', 'array-contains-any', [channelID])
//         .onSnapshot(documentSnapshot => {
//           if (!documentSnapshot?.empty) {
//             const temp = [];
//             documentSnapshot?.docs.forEach(doc => {
//               const data = doc.data();

//               const obj = {
//                 id: doc.id,
//                 ...data,
//                 created_at: data?.created_at?.toDate(),
//                 updated_at: data?.updated_at?.toDate(),
//               };
//               dispatch({
//                 type: READ_CHANNEL_DETAILS,
//                 payload: {[doc.id]: obj},
//               });
//             });
//           }
//         });

//     } catch (e) {}
//   };
// };
