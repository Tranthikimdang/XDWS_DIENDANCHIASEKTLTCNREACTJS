const { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc } = require('firebase/firestore/lite');
const db = require('../config/firebaseconfig.js');

const addArticle = async (articles) => {
  try {
    const docRef = await addDoc(collection(db, 'articles'), articles);
    return docRef.id;
  } catch (e) {
    console.log(e);
    throw new Error('Error adding document: ' + e.message);
  }
};

const getList = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'articles'));
    const article = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return article;
  } catch (e) {
    throw new Error('Error getting documents: ' + e.message);
  }
};

const getArticleById = async (id) => {
  try {
    const docRef = doc(db, 'articles', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('No such document!');
    }
  } catch (e) {
    throw new Error('Error getting document: ' + e.message);
  }
};

const updateArticle = async (id, updatedData) => {
  try {
    const articleDoc = doc(db, 'articles', id);
    await updateDoc(articleDoc, updatedData);
    return `Article with id ${id} updated successfully.`;
  } catch (e) {
    console.error('Error updating document:', e);
    throw new Error('Error updating document: ' + e.message);
  }
};

const deleteArticle = async (id) => {
  try {
    const docRef = doc(db, 'articles', id);
    await deleteDoc(docRef);
    return true;
  } catch (e) {
    throw new Error('Error deleting document: ' + e.message);
  }
};

module.exports = {
  addArticle,
  getList,
  getArticleById,
  updateArticle,
  deleteArticle
};
