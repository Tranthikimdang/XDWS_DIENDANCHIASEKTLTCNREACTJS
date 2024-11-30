// chatbox.js
import React, { useEffect, useState, useRef } from 'react';
import { db } from '../../config/firebaseconfig';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  where,
} from 'firebase/firestore';
import { TextField, Button, Box, Typography, Divider, Avatar, Paper } from '@mui/material';
import PropTypes from 'prop-types';
import './chatbox.css'; // Đảm bảo bạn đã thêm các hiệu ứng CSS cần thiết

const Chat = ({ participants }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const sender = participants[0];
  const receiver = participants[1];

  useEffect(() => {
    if (!sender || !receiver) return;

    const q = query(
      collection(db, 'messages'),
      where('senderId', 'in', [sender.id, receiver.id]),
      where('receiverId', 'in', [sender.id, receiver.id]),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [participants, sender, receiver]);

  const sendMessage = async () => {
    if (input.trim() === '' || !sender || !receiver) return;

    const message = {
      senderId: sender.id,
      receiverId: receiver.id,
      text: input.trim(),
      createdAt: new Date(), // Đảm bảo rằng đây là đối tượng Date
    };

    // Thêm tin nhắn tạm thời vào state để hiển thị ngay lập tức
    setMessages((prevMessages) => [...prevMessages, { ...message, id: Date.now().toString() }]);
    setInput('');

    try {
      // Thêm tin nhắn vào Firestore
      await addDoc(collection(db, 'messages'), message);
    } catch (error) {
      console.error('Error sending message:', error);
      // Xử lý lỗi nếu cần, ví dụ: thông báo cho người dùng
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatTime = (timestamp) => {
    if (timestamp instanceof Date) {
      return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (typeof timestamp === 'string') {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return '';
  };

  return (
    <Box sx={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        Chat với {receiver?.name || 'Người dùng'}
      </Typography>
      <Divider />
      <Box sx={{ flexGrow: 1, overflowY: 'auto', marginTop: '10px', paddingRight: '10px' }}>
        {messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              display: 'flex',
              flexDirection: msg.senderId === sender.id ? 'row-reverse' : 'row',
              alignItems: 'flex-start',
              marginBottom: '10px',
              animation: 'fadeIn 0.3s ease-in-out',
            }}
          >
            <Avatar
              src={msg.senderId === sender.id ? sender.avatar : receiver.avatar}
              alt={msg.senderId === sender.id ? sender.name : receiver.name}
              sx={{ width: 30, height: 30, marginLeft: msg.senderId === sender.id ? '0' : '10px', marginRight: msg.senderId === sender.id ? '10px' : '0' }}
            />
            <Paper
              elevation={3}
              sx={{
                padding: '10px 15px',
                borderRadius: '15px',
                backgroundColor: msg.senderId === sender.id ? '#DCF8C6' : '#FFFFFF',
                maxWidth: '70%',
              }}
            >
              <Typography variant="body1">{msg.text}</Typography>
              <Typography variant="caption" color="textSecondary" sx={{ display: 'block', textAlign: 'right', marginTop: '5px' }}>
                {formatTime(msg.createdAt)}
              </Typography>
            </Paper>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>
      <Box sx={{ display: 'flex', marginTop: '10px' }}>
        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập tin nhắn..."
          variant="outlined"
          fullWidth
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={sendMessage}
          sx={{ marginLeft: '10px' }}
        >
          Gửi
        </Button>
      </Box>
    </Box>
  );
};

Chat.propTypes = {
  participants: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string, // Thêm avatar nếu có
    })
  ).isRequired,
};

export default Chat;