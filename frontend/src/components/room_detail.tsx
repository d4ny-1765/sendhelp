import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Stack, TextField, Card, CardContent } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from '../utils/api';

interface RoomType {
  roomId: number;
  hostId: number;
  topicId: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  messageID: number;
  title: string;
  body: string;
  senderID: number;
  createdAt: string;
}

const RoomDetail: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [room, setRoom] = useState<RoomType | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editMessage, setEditMessage] = useState('');
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!roomId) return;
    apiFetch(`/api/v1/rooms/${roomId}`)
      .then(data => setRoom(data))
      .catch(console.error);
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;
    fetch(`/api/v1/messages?roomId=${roomId}`)
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(console.error);
  }, [roomId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !auth?.user.userId || !roomId) return;

    try {
      const response = await fetch('/api/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth?.token || ''}`
        },
        body: JSON.stringify({
          body: newMessage,
          senderID: auth.user.userId,
          roomId: parseInt(roomId),
          title: 'Comment'
        })
      });

      if (response.ok) {
        const message = await response.json();
        setMessages(prev => [...prev, message]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleEditMessage = async (messageId: number) => {
    if (!editMessage.trim() || !auth?.user.userId) return;

    try {
      const response = await fetch(`/api/v1/messages/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth?.token || ''}`
        },
        body: JSON.stringify({
          body: editMessage,
          title: 'Comment'
        })
      });

      if (response.ok) {
        const updatedMessage = await response.json();
        setMessages(prev => prev.map(msg => 
          msg.messageID === messageId ? updatedMessage : msg
        ));
        setEditingMessageId(null);
        setEditMessage('');
      }
    } catch (error) {
      console.error('Failed to edit message:', error);
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    try {
      const response = await fetch(`/api/v1/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth?.token || ''}`
        }
      });

      if (response.ok) {
        setMessages(prev => prev.filter(msg => msg.messageID !== messageId));
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  if (!room) {
    return <Typography>Loading room...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h4">{room.name}</Typography>
        <Typography variant="subtitle2">Host {room.roomId}</Typography>
        {room.description && <Typography>{room.description}</Typography>}
        <Typography variant="caption" color="text.secondary">
          Created at: {new Date(room.createdAt).toLocaleString()}
        </Typography>

        <Typography variant="h6" sx={{ mt: 4 }}>Comments</Typography>
        <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
          {messages.map(message => (
            <Card key={message.messageID} sx={{ mb: 1, bgcolor: 'grey.100' }}>
              <CardContent>
                {editingMessageId === message.messageID ? (
                  <Stack direction="row" spacing={1}>
                    <TextField
                      fullWidth
                      size="small"
                      value={editMessage}
                      onChange={(e) => setEditMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleEditMessage(message.messageID)}
                    />
                    <Button onClick={() => handleEditMessage(message.messageID)}>Save</Button>
                    <Button onClick={() => {
                      setEditingMessageId(null);
                      setEditMessage('');
                    }}>Cancel</Button>
                  </Stack>
                ) : (
                  <>
                    <Typography variant="body1">{message.body}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(message.createdAt).toLocaleString()}
                    </Typography>
                    {auth?.user.userId === message.senderID && (
                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        <Button 
                          size="small" 
                          onClick={() => {
                            setEditingMessageId(message.messageID);
                            setEditMessage(message.body);
                          }}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteMessage(message.messageID)}
                        >
                          Delete
                        </Button>
                      </Stack>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>

        <Stack direction="row" spacing={1}>
          <TextField
            fullWidth
            size="small"
            placeholder="Write a comment..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button 
            variant="contained" 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            Send
          </Button>
        </Stack>

        <Button component={RouterLink} to="/" variant="outlined">
          Back to Rooms
        </Button>
        <Stack direction="row" spacing={1}>
          <Button variant="contained" onClick={() => navigate(`/room_form?roomId=${room.roomId}`)}>
            Edit
          </Button>
          <Button variant="outlined" color="error" onClick={async () => {
            await apiFetch(`/api/v1/rooms/${room.roomId}`, { method: 'DELETE' });
            navigate('/');
          }}>
            Delete
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default RoomDetail;
