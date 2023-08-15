import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Fab,
  Avatar,
  Skeleton,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const ChatMessage = ({ text, isSender, seen }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: isSender ? 'row-reverse' : 'row',
      alignItems: 'flex-start',
      marginBottom: '10px',
    }}
  >
    <Avatar
      alt="User Avatar"
      src={isSender ? '/sender_avatar.jpg' : '/receiver_avatar.jpg'}
      style={{
        marginRight: isSender ? '10px' : '0',
        marginLeft: isSender ? '0' : '10px',
      }}
    />
    <Paper
      elevation={3}
      style={{
        padding: '10px',
        maxWidth: '70%',
        borderRadius: isSender ? '15px 0 15px 15px' : '0 15px 15px 15px',
        backgroundColor: isSender ? '#DCF8C6' : 'white',
      }}
    >
      <Typography>{text}</Typography>
      <div
        style={{
          display: 'flex',
          justifyContent: isSender ? 'flex-end' : 'flex-start',
          alignItems: 'center',
          marginTop: '5px',
        }}
      >
        {seen ? (
          <DoneAllIcon color="primary" fontSize="small" />
        ) : (
          <CheckIcon color="primary" fontSize="small" />
        )}
        <Typography variant="caption" style={{ marginLeft: '5px' }}>
          10:30 AM {/* Replace with the actual timestamp */}
        </Typography>
      </div>
    </Paper>
  </div>
);

const ChatApp = () => {
  const [messages, setMessages] = useState([
    { text: 'Hello!', isSender: true, seen: true },
    { text: 'Hi there!', isSender: false, seen: false },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Simulate loading messages
    setTimeout(() => {
      const newMessages = Array.from({ length: 2 }, (_, index) => ({
        text: `Message ${index + 1}`,
        isSender: index % 2 === 0,
        seen: true,
      }));
      setMessages((prevMessages) => [...prevMessages, ...newMessages]);
      setLoading(false);
    }, 5000); // Simulate loading for 5 seconds
  }, []);

  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      setMessages([
        ...messages,
        { text: newMessage, isSender: true, seen: false },
      ]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && newMessage.trim() !== '') {
      sendMessage();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          width: '100%',
          marginBottom: '20px',
        }}
      >
        {loading ? (
          <>
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="text" width="70%" />
          </>
        ) : (
          messages.map((message, index) => (
            <ChatMessage
              key={index}
              text={message.text}
              isSender={message.isSender}
              seen={message.seen}
            />
          ))
        )}
      </div>
      <TextField
        label="Type a message..."
        variant="outlined"
        fullWidth
        value={newMessage}
        onKeyPress={handleKeyPress}
        onChange={(e) => setNewMessage(e.target.value)}
        style={{ marginBottom: '10px' }}
      />
      <Button variant="contained" color="primary" onClick={sendMessage}>
        Send
      </Button>
    </div>
  );
};

export default ChatApp;
