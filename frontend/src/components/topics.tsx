import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface Topic {
  topicId: number;
  name: string;
}

const Topics: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    fetch('/api/v1/topics')
      .then(res => res.json())
      .then(data => setTopics(data))
      .catch(console.error);
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
            to={`/rooms?topicId=${topic.topicId}`}
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