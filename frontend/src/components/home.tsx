// src/components/Home.tsx
import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Topics from './topics';
import Rooms from './room';
import Sidebar from './feed_component';

const Home: React.FC = () => {
  return (
    <Container sx={{ backgroundColor: '#daddd8', borderRadius: 2, boxShadow: 3, p: 3 }} maxWidth="md">
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
