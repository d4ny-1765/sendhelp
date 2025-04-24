import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Avatar, Button, Stack } from '@mui/material';
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
        <Card key={r.roomId} sx={{ mb: 2, bgcolor: 'grey.800', color: 'grey.100' }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar src={`/avatars/${r.hostId}.png`} />
              <Box flexGrow={1}>
                <Typography variant="caption">Host {r.hostId}</Typography>
                <Typography variant="h6">{r.name}</Typography>
                {r.description && <Typography variant="body2">{r.description}</Typography>}
                <Typography variant="caption" color="text.secondary">
                  {new Date(r.createdAt).toLocaleString()}
                </Typography>
              </Box>
              <Button size="small" variant="outlined">Join</Button>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default Rooms;