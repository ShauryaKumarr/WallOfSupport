import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyCyEqGnnMr0IcvrPs_PcLxvb9Nw1ozE_Xc',
  authDomain: 'wallofsupport-22a63.firebaseapp.com',
  databaseURL: 'https://wallofsupport-22a63-default-rtdb.firebaseio.com',
  projectId: 'wallofsupport-22a63',
  storageBucket: 'wallofsupport-22a63.appspot.com',
  messagingSenderId: '240950716993',
  appId: '1:240950716993:web:b54a37bd8dcab30f2c34c0',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getDatabase(app);
