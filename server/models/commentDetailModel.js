const { collection, addDoc, getDocs, doc,updateDoc, deleteDoc, getDoc } = require('firebase/firestore/lite');
const db = require('../config/firebaseconfig.js');

const addComment = async (commentDetail) => {
  try {
    const docRef = await addDoc(collection(db, 'commentDetails'), commentDetail);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document:', e.message);
    throw new Error('Error adding document: ' + e.message);
  }
};

const getAllComment = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'commentDetails'));
    const comment = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return comment;
  } catch (e) {
    throw new Error('Error getting documents: ' + e.message);
  }
};

const updatedComment = async (id, updatedData) => {
  try {
    const commentDetailDoc = doc(db, 'commentDetails', id);
    await updateDoc(commentDetailDoc, updatedData);
    return `Article with id ${id} updated successfully.`;
  } catch (e) {
    console.error('Error updating document:', e);
    throw new Error('Error updating document: ' + e.message);
  }
};

const deleteComment = async (id) => {
  try {
    const docRef = doc(db, 'commentDetails', id);
    await deleteDoc(docRef);
    return true;
  } catch (e) {
    throw new Error('Error deleting document: ' + e.message);
  }
};

const getCommentById = async (id) => {
  try {
    const docRef = doc(db, 'commentDetails', id);
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

const getCommentsByArticleId = async (articleId) => {
  try {
    const querySnapshot = await getDocs(collection(db, 'commentDetails'));
    const comments = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(comment => comment.articleId === articleId);
    return comments;
  } catch (e) {
    throw new Error('Error getting documents: ' + e.message);
  }
}

module.exports = {
  addComment,
  getAllComment,
  updatedComment,
  deleteComment,
  getCommentById,
  getCommentsByArticleId
};
