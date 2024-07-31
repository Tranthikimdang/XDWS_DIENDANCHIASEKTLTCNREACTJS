const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore/lite');

const firebaseConfig = {
  apiKey: "AIzaSyA6c0pPb4uxoK70RaM15lyX_cDk1aMYUv4",
  authDomain: "server-1603b.firebaseapp.com",
  projectId: "server-1603b",
  storageBucket: "server-1603b.appspot.com",
  messagingSenderId: "482978891201",
  appId: "1:482978891201:web:ba464b6cbe7abba973db40",
  measurementId: "G-VVRVKRXLXQ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = db;

