import {GET_MY_DETAIL, SET_TOKEN} from '../actions/users';

const initialState = {
  token: null,
  mydetails: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_TOKEN:
      return {
        ...state,
        token: action.payload,
      };
    case GET_MY_DETAIL:
      return {
        ...state,
        mydetails: action.payload,
      };
  }
  return state;
};
