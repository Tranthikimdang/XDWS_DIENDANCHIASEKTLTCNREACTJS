const { collection, addDoc, getDocs, doc,deleteDoc } = require('firebase/firestore/lite');
const db = require('../config/firebaseconfig.js');

const addComment = async (commentDetail) => {
  try {
    const docRef = await addDoc(collection(db, 'commentDetail'), commentDetail);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document:', e.message);
    throw new Error('Error adding document: ' + e.message);
  }
};

const getAllComment = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'commentDetail'));
    const commentDetail = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return commentDetail;
  } catch (e) {
    throw new Error('Error getting documents: ' + e.message);
  }
};


const deleteComment = async (id) => {
  try {
    const docRef = doc(db, 'commentDetail', id);
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
