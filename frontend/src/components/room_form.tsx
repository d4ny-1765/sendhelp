// src/components/RoomForm.tsx

import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Stack, Typography, Autocomplete } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';

interface Topic { topicId: number; name: string; }

const RoomForm: React.FC = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  if (!auth) return <Typography>Please login to create a room.</Typography>;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [topicInput, setTopicInput] = useState('');

  useEffect(() => {
    apiFetch('/api/v1/topics')
      .then(setTopics)
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // ensure topic exists or create new
      let finalTopicId: number;
      if (selectedTopic && topics.find(t => t.topicId === selectedTopic.topicId)) {
        finalTopicId = selectedTopic.topicId;
      } else if (topicInput) {
        const newTopic: Topic = await apiFetch('/api/v1/topics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: topicInput })
        });
        finalTopicId = newTopic.topicId;
      } else {
        console.error('Topic is required');
        return;
      }

      // Just create the room and redirect
      await apiFetch('/api/v1/rooms', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify({ name, description, topicId: finalTopicId }),
      });

      setName('');
      setDescription('');
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h6">Create Room</Typography>
        <TextField
          label="Room Name"
          required
          fullWidth
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <TextField
          label="Description"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <Autocomplete
          freeSolo
          options={topics}
          getOptionLabel={(opt) => typeof opt === 'string' ? opt : opt.name}
          value={selectedTopic}
          inputValue={topicInput}
          onChange={(_event, newVal) => setSelectedTopic(typeof newVal === 'string' ? { topicId: 0, name: newVal } : newVal)}
          onInputChange={(_event, newInput) => setTopicInput(newInput)}
          renderInput={(params) => <TextField {...params} label="Topic" required fullWidth />}
          isOptionEqualToValue={(option, value) => 
            option.topicId === value.topicId
          }
          getOptionKey={(option) => typeof option === 'string' ? option : option.topicId}
        />
        <Button type="submit" variant="contained">Create Room</Button>
      </Stack>
    </Box>
  );
};

export default RoomForm;
