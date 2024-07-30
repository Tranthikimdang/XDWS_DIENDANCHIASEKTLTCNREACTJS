const { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } = require('firebase/firestore/lite');
const db = require('../config/firebaseconfig');

const add = async (authority) => {
  try {
    console.log(authority);
    const docRef = await addDoc(collection(db, 'authority'), authority);
    return docRef.id;
  } catch (e) {
    console.log(e);
    throw new Error('Error adding document: ' + e.message);
  }
};

const getAll = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'authority'));
    const authoritys = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return authoritys;
  } catch (e) {
    throw new Error('Error getting documents: ' + e.message);
  }
};

const update = async (id, updatedData) => {
  try {
    const authorityDoc = doc(db, 'authority', id);
    await updateDoc(authorityDoc, updatedData);
    return `Authority with id ${id} updated successfully.`;
  } catch (e) {
    throw new Error('Error updating document: ' + e.message);
  }
};

const dele = async (id) => {
  try {
    const docRef = doc(db, 'authority', id);
    await deleteDoc(docRef);
    return true;
  } catch (e) {
    throw new Error('Error deleting document: ' + e.message);
  }
};

module.exports = {
  add,
  getAll,
  update,
  dele
};
