import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Button, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

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

  useEffect(() => {
    fetch('/api/v1/rooms')
      .then(res => res.json())
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
        <Card
          key={r.roomId}
          component={RouterLink}
          to={`/rooms/${r.roomId}`}
          sx={{ mb: 2, textDecoration: 'none', bgcolor: 'grey.800', color: 'grey.100' }}
        >
          <CardContent>
            <Typography variant="caption">Host {r.hostId}</Typography>
            <Typography variant="h6" gutterBottom>{r.name}</Typography>
            {r.description && <Typography variant="body2">{r.description}</Typography>}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default Rooms;