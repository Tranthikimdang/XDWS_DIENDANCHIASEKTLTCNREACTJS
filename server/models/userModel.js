const { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } = require('firebase/firestore/lite');
const db = require('../config/firebaseconfig.js');

// const { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } = require('firebase/firestore/lite');
// const db = require('../config/firebaseconfig');

// Add a new user
const addUser = async (user) => {
  try {
    const docRef = await addDoc(collection(db, 'users'), user);
    return docRef.id;
  } catch (e) {
    console.error('Error adding user:', e.message);
    throw new Error('Error adding user: ' + e.message);
  }
};

// Get all users
const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return users;
  } catch (e) {
    console.error('Error getting users:', e.message);
    throw new Error('Error getting users: ' + e.message);
  }
};

// Update a user by ID
const updateUser = async (id, updatedData) => {
  try {
    const userDoc = doc(db, 'users', id);
    await updateDoc(userDoc, updatedData);
    return `User with id ${id} updated successfully.`;
  } catch (e) {
    console.error('Error updating user:', e.message);
    throw new Error('Error updating user: ' + e.message);
  }
};

// Delete a user by ID
const deleteUser = async (id) => {
  try {
    const docRef = doc(db, 'users', id);
    await deleteDoc(docRef);
    return true;
  } catch (e) {
    console.error('Error deleting user:', e.message);
    throw new Error('Error deleting user: ' + e.message);
  }
};

const getOneUserByEmail = async (email) => {
  try {
    const usersCollection = collection(db, 'users');
    const userDocs = await getDocs(query(usersCollection, where("email", "==", email)));
    
    if (userDocs.empty) {
      return null; // Trả về null nếu không tìm thấy người dùng
    }
    
    return userDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }))[0]; // Trả về người dùng đầu tiên tìm thấy
  } catch (e) {
    console.error('Error getting user by email:', e.message);
    throw new Error('Error getting user by email: ' + e.message);
  }
};

module.exports = {
  addUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getOneUserByEmail
};
