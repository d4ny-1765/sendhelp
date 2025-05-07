import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { apiFetch } from '../utils/api';

interface Topic {
  topicId: number;
  name: string;
}

const Topics: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    async function loadTopics() {
      try {
        const topicsData: Topic[] = await apiFetch('/api/v1/topics').then(res => res.json());
        const validTopics: Topic[] = [];
        for (const t of topicsData) {
          const rooms = await apiFetch(`/api/v1/rooms?topicId=${t.topicId}`).then(r => r.json());
          if (rooms.length > 0) {
            validTopics.push(t);
          } else {
            // delete empty topic
            await apiFetch(`/api/v1/topics/${t.topicId}`, { method: 'DELETE' });
          }
        }
        setTopics(validTopics);
      } catch (err) {
        console.error(err);
      }
    }
    loadTopics();
  }, []);

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Browse Topics
      </Typography>
      <List disablePadding>
        {topics.map(topic => (
          <ListItem
            key={topic.topicId}
            component={RouterLink}
            to={`/?topicId=${topic.topicId}`}
            sx={{ px: 0 }}
          >
            <ListItemText primary={topic.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Topics;