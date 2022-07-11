import {
  READ_LASTMESSAGE,
  READ_MESSAGE,
  READ_CHANNEL_DETAILS,
  TOTALCHAT,
} from '../actions/messages';

const initialState = {
  messages: {},
  lastmessage: {},
  channelDetails: [],
  total_read: 0,
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

    case READ_CHANNEL_DETAILS:
      //console.log('reducer', action.payload);
      return {
        ...state,
        channelDetails: action.payload,
      };

    case TOTALCHAT:
      console.log('reducer', action.payload);
      return {
        ...state,
        total_read: action.payload,
      };

    default:
      return state;
  }
};
