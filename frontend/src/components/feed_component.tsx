import React from 'react';
import { Box, Typography, Card, CardContent, Avatar, Button, Stack } from '@mui/material';

const hosts = ['Praveen Kumar','Dennis Ivanov','Gary Simon'];

const Sidebar: React.FC = () => (
  <Box>
    <Typography variant="subtitle1" gutterBottom>Top Hosts</Typography>
    {hosts.map(name => (
      <Card key={name} sx={{ mb: 1, bgcolor: 'grey.800', color: 'grey.100' }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar /> 
            <Typography>{name}</Typography>
          </Stack>
          <Button size="small" variant="outlined">Follow</Button>
        </CardContent>
      </Card>
    ))}

    <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>Recent Activities</Typography>
    {/* Repeat similar cards for activity… */}
  </Box>
);

export default Sidebar;