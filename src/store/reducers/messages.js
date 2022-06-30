import {
  READ_LASTMESSAGE,
  READ_MESSAGE,
  SEND_MESSAGE,
} from '../actions/messages';

const initialState = {
  messages: {},
  lastmessage: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case READ_MESSAGE:
      return {
        ...state,
        messages: {...state.messages, ...action.payload},
      };
    case READ_LASTMESSAGE:
      return {
        ...state,
        lastmessage: action.payload,
      };

    // case SEND_MESSAGE:
    //   let newMessage=''
    //   return {
    //     ...state,
    //     messages: {...state.messages, ...newMessage},
    //   };
  }
  return state;
};
