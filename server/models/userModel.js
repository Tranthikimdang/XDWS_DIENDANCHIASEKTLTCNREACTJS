const { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } = require('firebase/firestore/lite');
const db = require('../config/firebaseconfig.js');


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

const getOneUser = async (email) => {
  try {
    const q = query(collection(db, 'users'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      throw new Error('No user found with the provided email.');
    }
    const user = querySnapshot.docs[0].data();
    return user;
  } catch (e) {
    console.error('Error getting user:', e.message);
    throw new Error('Error getting user: ' + e.message);
  }
};

module.exports = {
  addUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getOneUser
};
