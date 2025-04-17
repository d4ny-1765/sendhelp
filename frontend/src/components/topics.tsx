import React from 'react';
import { Box, List, ListItem, ListItemText, Button, Typography } from '@mui/material';

const topics = [
  { name: 'All', count: 9 },
  { name: 'Python', count: 2 },
  { name: 'HTML', count: 0 },
  // …add yours
];

const Topics: React.FC = () => (
  <Box>
    <Typography variant="subtitle1" gutterBottom>Browse Topics</Typography>
    <List disablePadding>
      {topics.map(t => (
        <ListItem
          key={t.name}
          secondaryAction={
            <Button size="small" variant="outlined">Follow</Button>
          }
        >
          <ListItemText
            primary={t.name}
            secondary={t.count > 0 ? `(${t.count})` : null}
          />
        </ListItem>
      ))}
    </List>
  </Box>
);

export default Topics;