import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import { Avatar, IconButton } from '@mui/material';
import userIcon from '../assets/user.png';
import NotificationsIcon from '@mui/icons-material/Notifications';

const Navbar: React.FC = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#04a777' }}>
      <Toolbar>
        {/* Site title / logo */}
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          ComplainIt
        </Typography>

        {/* Navigation buttons */}
        <IconButton
  component={RouterLink}
  to="/notifications" // Or wherever you want to link
  color="inherit"
  sx={{ ml: 1 }}
>
  <NotificationsIcon />
</IconButton>
        <IconButton component={RouterLink} to="/profile" sx={{ p: 0, ml: 2 }}>
  <Avatar
    src={userIcon}
    alt="Profile"
    sx={{ width: 36, height: 36 }}
  />
</IconButton>

        <Button color="inherit" component={RouterLink} to="/login">
          Login
        </Button>
        
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

/*  profile icon by Freepik - Flaticon*/