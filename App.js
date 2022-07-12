/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React, {useEffect} from 'react';

import {PersistGate} from 'redux-persist/integration/react';
import thunk from 'redux-thunk';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';

import userReducers from './src/store/reducers/users';
import messageReducers from './src/store/reducers/messages';
import NavIndex from './src/navigations';
import {Provider} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, Text, SafeAreaView, StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
const rootReducer = combineReducers({
  user: userReducers,
  message: messageReducers,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const enhancer = applyMiddleware(thunk);
//const Store = createStore(rootReducer, applyMiddleware(thunk));
const Store = createStore(persistedReducer, enhancer);
let persistor = persistStore(Store);

import SplashScreen from 'react-native-splash-screen';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <SafeAreaProvider style={{flex: 1, backgroundColor: '#101D24'}}>
      <Provider store={Store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavIndex />
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
