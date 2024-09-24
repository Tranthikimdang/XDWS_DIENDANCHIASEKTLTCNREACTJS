import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Thêm dòng này
// Cấu hình Firebase
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

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Firestore
const db = getFirestore(app);
const storage = getStorage(app); // Khởi tạo Firebase Storage
// Export db
export { db, storage }; // Xuất db và storage
