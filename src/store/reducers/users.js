import {GET_MY_DETAIL, SET_MYID} from '../actions/users';

const initialState = {
  myid: null,
  mydetails: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_MYID:
      return {
        ...state,
        myid: action.payload,
      };
    case GET_MY_DETAIL:
      return {
        ...state,
        mydetails: action.payload,
      };
  }
  return state;
};
