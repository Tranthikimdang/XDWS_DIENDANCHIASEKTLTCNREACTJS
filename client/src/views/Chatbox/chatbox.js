import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserAPI from '../../apis/UserApI';
import { db } from '../../config/firebaseconfig';
import "./chatbox.css";

function Chatbox() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    const userId = loggedInUser ? loggedInUser.id : null;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await UserAPI.getUsersList();
                setUsers(response.data.users);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu người dùng:", error);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        if (selectedUser) {
            const q = query(
                collection(db, 'chat'),
                where('userId', 'in', [userId, selectedUser.id]),
                where('recipientId', 'in', [userId, selectedUser.id]),
                orderBy('timestamp')
            );
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const messagesData = [];
                querySnapshot.forEach((doc) => {
                    messagesData.push({ ...doc.data(), id: doc.id });
                });
                setMessages(messagesData);
            });

            return () => unsubscribe();
        }
    }, [selectedUser, userId]);

    const onSelectUser = (user) => {
        setSelectedUser(user);
        navigate(`/chat/${user.id}`);
    };

    return (
        <div className="chat-container">
            <div>
                <h3>Trao Đổi và Thảo luận </h3>
                <p>Xin chào, {loggedInUser ? loggedInUser.name : 'Khách'}</p>
                {loggedInUser && (
                    <div className="logged-in-user">
                        <img className="user-avatar" src={loggedInUser.imageUrl} alt={`Ảnh đại diện của ${loggedInUser.name}`} />
                        <div className="user-info">
                            <p className="user-name">{loggedInUser.name}</p>
                            <p className="user-email">{loggedInUser.email}</p>
                        </div>
                    </div>
                )}
                <div className="user-cards">
                    {users.filter(user => user.id !== userId).map(user => (
                        <div key={user.id} className="user-card" onClick={() => onSelectUser(user)}>
                            <img className="user-avatar" src={user.imageUrl} alt={`Ảnh đại diện của ${user.name}`} />
                            <div className="user-info">
                                <p className="user-name">{user.name}</p>
                                <p className="user-last-message">{user.email}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Chatbox;