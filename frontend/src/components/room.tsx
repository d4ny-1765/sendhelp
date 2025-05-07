import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Button, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';

interface RoomType {
  roomId: number;
  hostId: number | null;
  topicId: number | null;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

const Rooms: React.FC = () => {
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    apiFetch('/api/v1/rooms')
      .then(data => setRooms(data))
      .catch(console.error);
  }, []);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Rooms</Typography>
        <Button component={RouterLink} to="/room_form" variant="contained">+ Create Room</Button>
      </Stack>
      {rooms.map(r => (
        <Box key={r.roomId} sx={{ mb: 2 }}>
            <Card
    component={RouterLink}
    to={`/rooms/${r.roomId}`}
    sx={{ 
      mb: 2, 
      textDecoration: 'none', 
      '&:hover': {
        backgroundColor: 'action.hover',
      }
    }}
  >         <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
      Host {r.hostId ? `#${r.hostId}` : 'Anonymous'}
    </Typography>
    <Typography variant="h6" color="primary" gutterBottom>
      {r.name}
    </Typography>
    {r.description && (
      <Typography variant="body2" color="text.secondary">
        {r.description}
      </Typography>
    )}
            </CardContent>
          </Card>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={() => navigate(`/room_form?roomId=${r.roomId}`)}>Edit</Button>
            <Button variant="outlined" color="error" onClick={async () => {
              await apiFetch(`/api/v1/rooms/${r.roomId}`, { method: 'DELETE' })
              setRooms(prev => prev.filter(x => x.roomId !== r.roomId))
            }}>Delete</Button>
          </Stack>
        </Box>
      ))}
    </Box>
  );
};

export default Rooms;