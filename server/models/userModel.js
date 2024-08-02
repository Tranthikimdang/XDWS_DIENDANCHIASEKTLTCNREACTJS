const { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } = require('firebase/firestore/lite');
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
    return `Category with id ${id} updated successfully.`;
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

module.exports = {
  addUser,
  getAllUsers,
  updateUser,
  deleteUser
};
