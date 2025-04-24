import React from 'react';
import { List, ListItem, ListItemText, Typography, Paper } from '@mui/material';

const topics = [
  'Python',
  'JavaScript',
  'HTML & CSS',
  'React',
  'Machine Learning',
  'Databases',
  'Networking',
  'UI/UX Design',
];

const TopicsComponent: React.FC = () => (
  <Paper sx={{ p: 2, borderRadius: 2, backgroundColor: '#f5f5f5' }}>
    <Typography variant="h6" sx={{ fontFamily: 'Inter', mb: 2 }}>
      Topics
    </Typography>
    <List>
      {topics.map((topic, idx) => (
        <ListItem key={idx} divider>
          <ListItemText
            primary={topic}
            primaryTypographyProps={{ sx: { fontFamily: 'Inter' } }}
          />
        </ListItem>
      ))}
    </List>
  </Paper>
);

export default TopicsComponent;