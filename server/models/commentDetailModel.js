const { collection, addDoc, getDocs, doc, deleteDoc, getDoc } = require('firebase/firestore/lite');
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
    const comment = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return comment;
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

const getCommentById = async (id) => {
  try {
    const docRef = doc(db, 'commentDetail', id);
    const comment = await getDoc(docRef);

    if (!comment.exists()) {
      throw new Error('Comment not found');
    }

    const article = await getDoc(doc(db, 'articles', comment.data().articleId));
    const user = await getDoc(doc(db, 'users', comment.data().userId));

    return {
      id: comment.id,
      ...comment.data(),
      article: article.data(),
      user: user.data(),
    };
  } catch (e) {
    throw new Error('Error getting document: ' + e.message);
  }
};

module.exports = {
  addComment,
  getAllComment,
  deleteComment,
  getCommentById,
};
