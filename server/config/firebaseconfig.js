const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore/lite');

const firebaseConfig = {
  // apiKey: "AIzaSyA6c0pPb4uxoK70RaM15lyX_cDk1aMYUv4",
  // authDomain: "server-1603b.firebaseapp.com",
  // projectId: "server-1603b",
  // storageBucket: "server-1603b.appspot.com",
  // messagingSenderId: "482978891201",
  // appId: "1:482978891201:web:ba464b6cbe7abba973db40",
  // measurementId: "G-VVRVKRXLXQ"

  apiKey: "AIzaSyBmL5rAJDEWlV2yzcxNthYN6oL1wqRnmyc",
  authDomain: "diendanghotrolaptrinh.firebaseapp.com",
  databaseURL: "https://diendanghotrolaptrinh-default-rtdb.firebaseio.com",
  projectId: "diendanghotrolaptrinh",
  storageBucket: "diendanghotrolaptrinh.appspot.com",
  messagingSenderId: "877984330150",
  appId: "1:877984330150:web:65bea998334befd12c5f67",
  measurementId: "G-E6LG4TQMMG"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = db;
