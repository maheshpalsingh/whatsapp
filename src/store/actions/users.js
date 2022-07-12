export const SET_MYID = 'SET_MYID';
export const GET_MY_DETAIL = 'GET_MY_DETAIL';
export const GET_ALL_CONTACTS = 'GET_ALL_CONTACTS';

export const setMyID = myid => {
  return {type: SET_MYID, payload: myid};
};

export const setMyDetails = mydetails => {
  return {type: GET_MY_DETAIL, payload: mydetails};
};

export const setAllContacts = contacts => {
  return {type: GET_ALL_CONTACTS, payload: contacts};
};
