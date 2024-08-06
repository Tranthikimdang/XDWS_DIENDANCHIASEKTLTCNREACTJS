const { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } = require('firebase/firestore/lite');
const db = require('../config/firebaseconfig.js');

// Add a new authorityDetail
const addUser = async (authorityDetail) => {
  try {
    const docRef = await addDoc(collection(db, 'authorityDetail'), authorityDetail);
    return docRef.id;
  } catch (e) {
    console.error('Error adding user:', e.message);
    throw new Error('Error adding user: ' + e.message);
  }
};

// Get all authorityDetail
const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'authorityDetail'));
    const authorityDetail = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return authorityDetail;
  } catch (e) {
    console.error('Error getting authorityDetail:', e.message);
    throw new Error('Error getting authorityDetail: ' + e.message);
  }
};


// Update a user by ID
const updateUser = async (id, updatedData) => {
  try {
    const userDoc = doc(db, 'authorityDetail', id);
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
    const docRef = doc(db, 'authorityDetail', id);
    await deleteDoc(docRef);
    return true;
  } catch (e) {
    console.error('Error deleting user:', e.message);
    throw new Error('Error deleting user: ' + e.message);
  }
};

const getOneUser = async (id) => {
  try {
    const userDoc = doc(db, 'authorityDetail', id);
    const userSnapshot = await getDoc(userDoc);
    if (userSnapshot.exists()) {
      return { id: userSnapshot.id, ...userSnapshot.data() };
    } else {
      throw new Error('User not found');
    }
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
