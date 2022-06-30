export const SET_TOKEN = 'SET_TOKEN';
export const GET_MY_DETAIL = 'GET_MY_DETAIL';

export const setToken = token => {
  return {type: SET_TOKEN, payload: token};
};

export const setMyDetails = mydetails => {
  return {type: GET_MY_DETAIL, payload: mydetails};
};
