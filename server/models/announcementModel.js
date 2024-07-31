const { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } = require('firebase/firestore/lite');
const db = require('../config/firebaseconfig');

const add = async (announcement) => {
  try {
    console.log(announcement);
    const docRef = await addDoc(collection(db, 'announcement'), announcement);
    return docRef.id;
  } catch (e) {
    console.log(e);
    throw new Error('Error adding document: ' + e.message);
  }
};

const getAll = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'announcement'));
    const announcements = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return announcements;
  } catch (e) {
    throw new Error('Error getting documents: ' + e.message);
  }
};

const update = async (id, updatedData) => {
  try {
    const announcementDoc = doc(db, 'announcement', id);
    await updateDoc(announcementDoc, updatedData);
    return `Announcement with id ${id} updated successfully.`;
  } catch (e) {
    throw new Error('Error updating document: ' + e.message);
  }
};

const dele = async (id) => {
  try {
    const docRef = doc(db, 'announcement', id);
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
