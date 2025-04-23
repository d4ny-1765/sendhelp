import React from 'react';
import { Box, Typography, Card, CardContent, Avatar, Stack, Button } from '@mui/material';


// Testing connecting it to backend

type Props = {
  room: Room;
  onUpdateTodo: (updatedTodo: Room) => void;
  onDeleteTodo: (deletedTodo: Room) => void;
};

// End testing

const rooms = [
  { host: '@praveen', title: 'Study Bud Chat', joined: 3, tag: 'Python' },
  { host: '@dennisivy', title: 'Who wants to learn python?', joined: 1, tag: 'Python' },
  { host: '@garysimon', title: 'Lets talk about HTML', joined: 2, tag: 'HTML' },
];

const Rooms: React.FC = () => (
  <Box>
    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="h6">Rooms</Typography>
      <Button variant="contained">+ Create Room</Button>
    </Stack>
    {rooms.map(r => (
      <Card key={r.title} sx={{ mb: 2, bgcolor: 'grey.800', color: 'grey.100' }}>
        <CardContent sx={{ backgroundColor: 'grey.900', borderRadius: 2, boxShadow: 3, p: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={`/avatars/${r.host}.png`} /> {/* or initials */}
            <Box flexGrow={1}>
              <Typography variant="caption">Host {r.host}</Typography>
              <Typography variant="h6">{r.title}</Typography>
              <Stack direction="row" spacing={1} mt={1} alignItems="center">
                <Avatar sx={{ width: 24, height: 24 }} /> {/* joined avatars */}
                <Typography variant="body2">{r.joined} Joined</Typography>
              </Stack>
            </Box>
            <Button size="small" variant="outlined">{r.tag}</Button>
          </Stack>
        </CardContent>
      </Card>
    ))}
  </Box>
);

export default Rooms;