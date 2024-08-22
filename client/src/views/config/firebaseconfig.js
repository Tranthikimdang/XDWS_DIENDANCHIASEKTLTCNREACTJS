// const { initializeApp } = require("firebase/app");
// const { getFirestore } = require("firebase/firestore/lite");


// const firebaseConfig = {
//   apiKey: "AIzaSyBmL5rAJDEWlV2yzcxNthYN6oL1wqRnmyc",
//   authDomain: "diendanghotrolaptrinh.firebaseapp.com",
//   databaseURL: "https://diendanghotrolaptrinh-default-rtdb.firebaseio.com",
//   projectId: "diendanghotrolaptrinh",
//   storageBucket: "diendanghotrolaptrinh.appspot.com",
//   messagingSenderId: "877984330150",
//   appId: "1:877984330150:web:65bea998334befd12c5f67",
//   measurementId: "G-E6LG4TQMMG",
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// module.exports = db;

const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore/lite");
const { getAuth, signInWithPopup, GoogleAuthProvider } = require("firebase/auth");

const firebaseConfig = {
  apiKey: "AIzaSyBmL5rAJDEWlV2yzcxNthYN6oL1wqRnmyc",
  authDomain: "diendanghotrolaptrinh.firebaseapp.com",
  databaseURL: "https://diendanghotrolaptrinh-default-rtdb.firebaseio.com",
  projectId: "diendanghotrolaptrinh",
  storageBucket: "diendanghotrolaptrinh.appspot.com",
  messagingSenderId: "877984330150",
  appId: "1:877984330150:web:65bea998334befd12c5f67",
  measurementId: "G-E6LG4TQMMG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = () => {
  signInWithPopup(auth, googleProvider)
    .then((result) => {
      const user = result.user;
      console.log("User info:", user);
      // You can handle user information here, such as storing it in the Firestore or redirecting the user
    })
    .catch((error) => {
      console.error("Error during Google sign-in:", error);
    });
};

module.exports = { db, signInWithGoogle };
