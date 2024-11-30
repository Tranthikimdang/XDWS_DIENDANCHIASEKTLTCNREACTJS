// ChatBox.js
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Fab } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import axios from 'axios';

const ChatBox = () => {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! How can I assist you today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: input }],
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
      });

      const aiMessage = {
        sender: 'ai',
        text: response.data.choices[0].message.content.trim(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error communicating with OpenAI:', error);
      setMessages((prev) => [...prev, { sender: 'ai', text: 'Sorry, I am unable to assist at the moment.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!open && (
        <Fab 
          color="primary" 
          aria-label="chat" 
          onClick={() => setOpen(true)} 
          sx={{ position: 'fixed', bottom: 20, right: 20 }}
        >
          <ChatIcon />
        </Fab>
      )}
      {open && (
        <Paper sx={{ position: 'fixed', bottom: 20, right: 20, width: 300, height: 400, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flexGrow: 1, padding: 2, overflowY: 'auto' }}>
            {messages.map((msg, index) => (
              <Box key={index} sx={{ mb: 1, textAlign: msg.sender === 'ai' ? 'left' : 'right' }}>
                <Typography variant="body2" color={msg.sender === 'ai' ? 'primary' : 'secondary'}>
                  {msg.text}
                </Typography>
              </Box>
            ))}
            {loading && <Typography variant="body2">AI is typing...</Typography>}
          </Box>
          <Box sx={{ display: 'flex', padding: 1, borderTop: '1px solid #ccc' }}>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSend();
                }
              }}
            />
            <Button onClick={handleSend} sx={{ ml: 1 }}>
              <SendIcon />
            </Button>
          </Box>
          <Button onClick={() => setOpen(false)} sx={{ mt: 1 }}>
            Close
          </Button>
        </Paper>
      )}
    </>
  );
};

export default ChatBox;