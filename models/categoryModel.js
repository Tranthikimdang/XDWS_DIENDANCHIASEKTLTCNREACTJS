const { collection, addDoc, getDocs, doc, updateDoc,deleteDoc } = require('firebase/firestore/lite');
const db = require('../config/firebaseconfig.js');

const addCategory = async (category) => {
  try {
    console.log(category)
    const docRef = await addDoc(collection(db, 'categories'), category);
    return docRef.id;
  } catch (e) {
    console.log(e)
    throw new Error('Error adding document: ' + e.message);
  }
};

const getAllCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    const categories = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return categories;
  } catch (e) {
    throw new Error('Error getting documents: ' + e.message);
  }
};

const updateCategory = async (id, updatedData) => {
  try {
    const categoryDoc = doc(db, 'categories', id);
    await updateDoc(categoryDoc, updatedData);
    return `Category with id ${id} updated successfully.`;
  } catch (e) {
    throw new Error('Error updating document: ' + e.message);
  }
};

const deleteCategory = async (id) => {
  try {
    const docRef = doc(db, 'categories', id);
    await deleteDoc(docRef);
    return true;
  } catch (e) {
    throw new Error('Error deleting document: ' + e.message);
  }
};
module.exports = {
  addCategory,
  getAllCategories,
  updateCategory,
  deleteCategory
};
