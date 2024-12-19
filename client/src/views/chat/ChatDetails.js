import React, { useEffect, useState } from 'react';
import { db } from '../../config/firebaseconfig';
import { collection, addDoc, onSnapshot, query, where, doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import './chatDetails.css';

function ChatDetails() {
    const { userId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [newImage, setNewImage] = useState(null);
    const [newFile, setNewFile] = useState(null);
    const [newCode, setNewCode] = useState('');
    const [showCodeInput, setShowCodeInput] = useState(false);
    const [userName, setUserName] = useState('');
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    const currentUserId = loggedInUser ? loggedInUser.id : null;
    const currentUserName = loggedInUser ? loggedInUser.name : 'User';

    useEffect(() => {
        const fetchUserName = async () => {
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
                setUserName(userDoc.data().name);
            }
        };

        const fetchMessages = () => {
            if (!currentUserId || !userId) return;

            const chatId = [currentUserId, userId].sort().join('_');

            const q = query(
                collection(db, 'chat'),
                where('chatId', '==', chatId)
            );

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const messagesData = [];
                querySnapshot.forEach((doc) => {
                    messagesData.push({ ...doc.data(), id: doc.id });
                });

                messagesData.sort((a, b) => a.timestamp?.toMillis() - b.timestamp?.toMillis());

                setMessages(messagesData);
            });

            return () => unsubscribe();
        };

        fetchUserName();
        fetchMessages();
    }, [currentUserId, userId]);

    const handleSendMessage = async () => {
        if (newMessage.trim() === '' && !newImage && !newFile && newCode.trim() === '') return;

        const chatId = [currentUserId, userId].sort().join('_');

        const data = {
            text: newMessage,
            chatId,
            userId: currentUserId,
            recipientId: userId,
            username: currentUserName,
            role: 'user', 
            timestamp: new Date(),
            imageUrl: newImage ? URL.createObjectURL(newImage) : null,
            fileUrl: newFile ? URL.createObjectURL(newFile) : null,
            codeSnippet: newCode,
        };

        await addDoc(collection(db, 'chat'), data);
        setNewMessage(''); // Clear the input field
        setNewImage(null); // Clear the image input
        setNewFile(null); // Clear the file input
        setNewCode(''); // Clear the code input
        setShowCodeInput(false); // Hide the code input
    };

    const formatDate = (timestamp) => {
        const date = timestamp.toDate();
        return date.toLocaleString();
    };

    return (
        <div className="chat-details-container">
            <h2>Trò chuyện với {userName} ({userId})</h2>
            <div className="chat-messages">
                {messages.map((message) => (
                    <div key={message.id} className={`message ${message.userId === currentUserId ? 'sent' : 'received'}`}>
                        <p style={{ margin: 0 }}><strong>{message.username}:</strong> </p>
                        {message.text && <p style={{ margin: 0 }}>{message.text}</p>}
                        {message.imageUrl && <img src={message.imageUrl} alt="Sent image" />}
                        {message.fileUrl && <a href={message.fileUrl} download>Download file</a>}
                        {message.codeSnippet && <pre><code>{message.codeSnippet}</code></pre>}
                        <span className="message-timestamp">{formatDate(message.timestamp)}</span>
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <div className="input-icons">
                    <label htmlFor="image-upload">
                        <img width="24" height="24" src="https://img.icons8.com/material-outlined/24/add-image.png" alt="add-image"/>
                    </label>
                    <input
                        id="image-upload"
                        type="file"
                        onChange={(e) => setNewImage(e.target.files[0])}
                        accept="image/*"
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="file-upload">
                        <img width="24" height="24" src="https://img.icons8.com/windows/32/file-upload.png" alt="file-upload"/>
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        onChange={(e) => setNewFile(e.target.files[0])}
                        style={{ display: 'none' }}
                    />
                    <label onClick={() => setShowCodeInput(!showCodeInput)}>
                        <img width="24" height="24" src="https://img.icons8.com/material-outlined/24/code.png" alt="add-code"/>
                    </label>
                </div>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Nhập tin nhắn"
                />
                {showCodeInput && (
                    <textarea
                        value={newCode}
                        onChange={(e) => setNewCode(e.target.value)}
                        placeholder="Nhập mã code"
                    />
                )}
                <button onClick={handleSendMessage}>Gửi</button>
            </div>
        </div>
    );
}

export default ChatDetails;