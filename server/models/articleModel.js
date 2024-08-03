const { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } = require('firebase/firestore/lite');
const db = require('../config/firebaseconfig.js');

const addArticle = async (article) => {
  try {
    const docRef = await addDoc(collection(db, 'article'), article);
    return docRef.id;
  } catch (e) {
    console.log(e);
    throw new Error('Error adding document: ' + e.message);
  }
};

const getList = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'article'));
    const article = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return article;
  } catch (e) {
    throw new Error('Error getting documents: ' + e.message);
  }
};

const updateArticle = async (id, updatedData) => {
  try {
    const articleDoc = doc(db, 'article', id);
    await updateDoc(articleDoc, updatedData);
    return `Article with id ${id} updated successfully.`;
  } catch (e) {
    console.error('Error updating document:', e);
    throw new Error('Error updating document: ' + e.message);
  }
};

const deleteArticle = async (id) => {
  try {
    const docRef = doc(db, 'article', id);
    await deleteDoc(docRef);
    return true;
  } catch (e) {
    throw new Error('Error deleting document: ' + e.message);
  }
};

module.exports = {
  addArticle,
  getList,
  updateArticle,
  deleteArticle
};