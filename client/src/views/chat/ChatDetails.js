import React, { useEffect, useState } from 'react';
import { db } from '../../config/firebaseconfig';
import { collection, addDoc, onSnapshot, query, where } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import './chatDetails.css';

function ChatDetails() {
    const { userId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    const currentUserId = loggedInUser ? loggedInUser.id : null;
    const currentUserName = loggedInUser ? loggedInUser.name : 'User';

    useEffect(() => {
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

        fetchMessages();
    }, [currentUserId, userId]);

    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return;

        const chatId = [currentUserId, userId].sort().join('_');

        const data = {
            text: newMessage,
            chatId,
            userId: currentUserId,
            recipientId: userId,
            username: currentUserName,
            role: 'user', 
            timestamp: new Date(),
        };

        await addDoc(collection(db, 'chat'), data);
        setNewMessage('');
    };

    const formatDate = (timestamp) => {
        const date = timestamp.toDate();
        return date.toLocaleString();
    };

    return (
        <div className="chat-details-container">
            <h2>Chat with User {userId}</h2>
            <div className="chat-messages">
                {messages.map((message) => (
                    <div key={message.id} className={`message ${message.userId === currentUserId ? 'sent' : 'received'}`}>
                        <p style={{ margin: 0 }}><strong>{message.username}:</strong> </p>
                        <p style={{ margin: 0 }}>{message.text}</p>
                        <span className="message-timestamp">{formatDate(message.timestamp)}</span>
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message"
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
}

export default ChatDetails;