// src/components/Home.tsx
import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Topics from './topics';
import Rooms from './room';
import Sidebar from './feed_component';

const Home: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Topics />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Rooms />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Sidebar />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
