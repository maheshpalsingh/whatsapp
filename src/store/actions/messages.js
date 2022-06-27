import  firestore  from "@react-native-firebase/firestore";


export const READ_MESSAGE = 'READ_MESSAGE';
export const SEND_MESSAGE = 'SEND_MESSAGE';

export const readAllMessages = (channelid) => {
  return async (dispatch) => {
    try {
       firestore()
        .collection("Channels")
        .doc(channelid)
        .collection("messages")
         .orderBy("created_at", "desc")
         .limit(100)
         .get()
         .then(documentSnapshot => {
            const temp = [];
            if (documentSnapshot) {
              documentSnapshot.docs.forEach(doc => {
                const data= doc.data()
                let date=data.created_at.toDate()
                let obj1={...data,created_at:date,message_id:doc.id}
                temp.push(obj1);

              });
            }
            dispatch({
              type: READ_MESSAGE,
              payload: {[channelid]:temp},
            });
        });
    } catch (e) {
      console.log('Error while fetching messages', e);
    }
  };
};

export const readNewMessage=(channelid,lastVisible)=>{
  return async (dispatch,getState) => {
    try {
      const prevMessages= getState().message.messages[channelid] || []
      firestore()
        .collection("Channels")
        .doc(channelid)
        .collection("messages")
        .where('created_at','>',new Date(lastVisible))
        .limit(100)
        .get()
        .then(documentSnapshot => {
          const temp = [];

          if (documentSnapshot) {
            documentSnapshot.docs.forEach(doc => {
              const data= doc.data()
              let date=data.created_at.toDate()
              let obj1={...data,created_at:date,message_id:doc.id}
              temp.push(obj1);
            });
          }
          if(temp.length>0)
          {
            dispatch({
              type: READ_MESSAGE,
              payload: {[channelid]:[...prevMessages,...temp]},
            });
          }

        });
    } catch (e) {
      console.log('Error while fetching messages', e);
    }
  };
}



// export const sendMessage=(channelid,newMessage,uid)=>{
//   return async (dispatch,getState) => {
//     try {
//       const prevMessages= getState().message.messages[channelid] || []
//       firestore()
//         .collection("Channels")
//         .doc(channelid)
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
//               payload: {[channelid]:[...prevMessages,...temp]},
//             });
//           }
//
//         });
//     } catch (e) {
//       console.log('Error while fetching messages', e);
//     }
//   };
// }



