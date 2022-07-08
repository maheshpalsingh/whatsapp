import {
  READ_LASTMESSAGE,
  READ_MESSAGE,
  READ_CHANNEL_DETAILS,
} from '../actions/messages';

const initialState = {
  messages: {},
  lastmessage: {},
  channelDetails: [],
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
      console.log('reducer', action.payload);
      return {
        ...state,
        channelDetails: action.payload,
      };
  }
  return state;
};
