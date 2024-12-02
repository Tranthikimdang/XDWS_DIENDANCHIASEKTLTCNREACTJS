import React, { createContext, useState, useEffect } from 'react';

export const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [notificationCount, setNotificationCount] = useState(0);
  
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'new_notification') {
        setNotificationCount((prevCount) => prevCount + 1);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      socket.close(); // Đóng kết nối khi component bị unmount
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ notificationCount }}>
      {children}
    </WebSocketContext.Provider>
  );
};
