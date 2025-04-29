import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import { Avatar, IconButton, TextField, InputAdornment, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import userIcon from '../assets/user.png';

const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#04a777' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Left: Site title / logo */}
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          ComplainIt
        </Typography>

        {/* Center: Search Bar */}
        <Box component="form" onSubmit={handleSearch} sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <TextField
            size="small"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              backgroundColor: 'white',
              borderRadius: 1,
              width: 400,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton type="submit" size="small">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Right: Icons and Login */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            component={RouterLink}
            to="/notifications"
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

          <Button color="inherit" component={RouterLink} to="/login" sx={{ ml: 2 }}>
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

/* profile icon by Freepik - Flaticon */
