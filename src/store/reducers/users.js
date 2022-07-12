import {GET_ALL_CONTACTS, GET_MY_DETAIL, SET_MYID} from '../actions/users';

const initialState = {
  myid: null,
  mydetails: {},
  contacts: [],
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
    case GET_ALL_CONTACTS:
      // console.log(action.payload);
      return {
        ...state,
        contacts: action.payload,
      };
  }
  return state;
};
