import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, TextField, Typography, IconButton } from '@mui/material';
import { Close, Send } from '@mui/icons-material';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // Update with your socket server URL

const ChatBox = ({ currentUser, recipientUser, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Join chat room
    const roomId = [currentUser.id, recipientUser.id].sort().join('-');
    socket.emit('join_room', roomId);

    // Listen for messages
    socket.on('receive_message', (message) => {
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    });

    // Load previous messages
    const loadMessages = async () => {
      try {
        const response = await fetch(`/api/messages/${roomId}`);
        const data = await response.json();
        setMessages(data);
        scrollToBottom();
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };
    loadMessages();

    return () => {
      socket.off('receive_message');
      socket.emit('leave_room', roomId);
    };
  }, [currentUser.id, recipientUser.id]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const messageData = {
      senderId: currentUser.id,
      recipientId: recipientUser.id,
      content: newMessage,
      roomId: [currentUser.id, recipientUser.id].sort().join('-'),
      timestamp: new Date()
    };

    socket.emit('send_message', messageData);
    setMessages(prev => [...prev, messageData]);
    setNewMessage('');
    scrollToBottom();
  };

  return (
    <Paper 
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 320,
        height: 400,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000
      }}
    >
      {/* Chat Header */}
      <Box sx={{ 
        p: 2, 
        bgcolor: 'primary.main', 
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6">{recipientUser.name}</Typography>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </Box>

      {/* Messages Area */}
      <Box sx={{ 
        flex: 1, 
        p: 2, 
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }}>
        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              alignSelf: message.senderId === currentUser.id ? 'flex-end' : 'flex-start',
              maxWidth: '70%'
            }}
          >
            <Paper sx={{
              p: 1,
              bgcolor: message.senderId === currentUser.id ? 'primary.light' : 'grey.100'
            }}>
              <Typography variant="body2">
                {message.content}
              </Typography>
            </Paper>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Nhập tin nhắn..."
        />
        <IconButton onClick={handleSend} color="primary">
          <Send />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default ChatBox;