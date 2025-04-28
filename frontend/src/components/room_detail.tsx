import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Button, Stack } from '@mui/material';

interface RoomType {
  roomId: number;
  hostId: number;
  topicId: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const RoomDetail: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [room, setRoom] = useState<RoomType | null>(null);

  useEffect(() => {
    if (!roomId) return;
    fetch(`/api/v1/rooms/${roomId}`)
      .then(res => res.json())
      .then(data => setRoom(data))
      .catch(console.error);
  }, [roomId]);

  if (!room) {
    return <Typography>Loading room...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h4">{room.name}</Typography>
        <Typography variant="subtitle2">Host {room.hostId}</Typography>
        {room.description && <Typography>{room.description}</Typography>}
        <Typography variant="caption" color="text.secondary">
          Created at: {new Date(room.createdAt).toLocaleString()}
        </Typography>
        <Button component={RouterLink} to="/" variant="outlined">
          Back to Rooms
        </Button>
      </Stack>
    </Box>
  );
};

export default RoomDetail;
