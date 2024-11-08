const { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc } = require('firebase/firestore/lite');
const db = require('../config/firebaseconfig.js');

const addQuestion = async (article) => {
    try {
        const docRef = await addDoc(collection(db, 'questions'), article);
        return docRef.id;
    } catch (e) {
        console.clear()
        console.log(e);
        throw new Error('Lỗi khi thêm câu hỏi: ' + e.message);
    }
};

const getList = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'questions'));
        const questions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return questions;
    } catch (e) {
        throw new Error('Lỗi khi lấy câu hỏi: ' + e.message);
    }
};

const getQuestionById = async (id) => {
    try {
        const docRef = doc(db, 'questions', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            throw new Error('Không có câu hỏi nào như vậy!');
        }
    } catch (e) {
        throw new Error('Lỗi khi tải câu hỏi: ' + e.message);
    }
};

const updateQuestion = async (id, updatedData) => {
    try {
        const articleDoc = doc(db, 'questions', id);
        await updateDoc(questionDoc, updatedData);
        return `Câu hỏi có ID ${id} cập nhật thành công.`;
    } catch (e) {
        console.error('Lỗi khi cập nhật câu hỏi:', e);
        throw new Error('Lỗi khi cập nhật câu hỏi: ' + e.message);
    }
};

const deleteQuestion = async (id) => {
    try {
        const docRef = doc(db, 'questions', id);
        await deleteDoc(docRef);
        return true;
    } catch (e) {
        throw new Error('Lỗi khi xóa câu hỏi: ' + e.message);
    }
};

module.exports = {
    addQuestion,
    getList,
    getQuestionById,
    updateQuestion,
    deleteQuestion
};
