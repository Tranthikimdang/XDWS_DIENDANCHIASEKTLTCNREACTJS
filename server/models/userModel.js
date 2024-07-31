const { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } = require('firebase/firestore/lite');
const db = require('../config/firebaseconfig');

const addUser = async (user) => {
  try {
    console.log(user);
    const docRef = await addDoc(collection(db, 'users'), user);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document:', e);
    throw new Error('Error adding document: ' + e.message);
  }
};

const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'user'));
    const user = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return user;
  } catch (e) {
    console.error('Error getting documents:', e);
    throw new Error('Error getting documents: ' + e.message);
  }
};

const updateUser = async (id, updatedData) => {
  try {
    const userDoc = doc(db, 'users', id);
    await updateDoc(userDoc, updatedData);
    return `User with id ${id} updated successfully.`;
  } catch (e) {
    console.error('Error updating document:', e);
    throw new Error('Error updating document: ' + e.message);
  }
};

const deleteUser = async (id) => {
  try {
    const docRef = doc(db, 'users', id);
    await deleteDoc(docRef);
    return true;
  } catch (e) {
    console.error('Error deleting document:', e);
    throw new Error('Error deleting document: ' + e.message);
  }
};

module.exports = {
  addUser,
  getAllUsers,
  updateUser,
  deleteUser
};
