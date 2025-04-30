import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import { Avatar, IconButton } from '@mui/material';
import userIcon from '../assets/user.png';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { auth, logout } = useAuth();
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
        {auth ? (
          <>
            <IconButton component={RouterLink} to="/profile" sx={{ p: 0, ml: 2 }}>
              <Avatar
                src={userIcon}
                sx={{ width: 36, height: 36 }}
              />
            </IconButton>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <Button color="inherit" component={RouterLink} to="/login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;