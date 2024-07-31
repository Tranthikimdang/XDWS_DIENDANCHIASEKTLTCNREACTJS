const { collection, addDoc, getDocs, doc,deleteDoc } = require('firebase/firestore/lite');
const db = require('../config/firebaseconfig.js');

const addComment = async (comment) => {
  try {
    const docRef = await addDoc(collection(db, 'comment'), comment);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document:', e.message);
    throw new Error('Error adding document: ' + e.message);
  }
};

const getAllComment = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'comment'));
    const comment = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return comment;
  } catch (e) {
    throw new Error('Error getting documents: ' + e.message);
  }
};


const deleteComment = async (id) => {
  try {
    const docRef = doc(db, 'comment', id);
    await deleteDoc(docRef);
    return true;
  } catch (e) {
    throw new Error('Error deleting document: ' + e.message);
  }
};
module.exports = {
  addComment,
  getAllComment,
  deleteComment
};
