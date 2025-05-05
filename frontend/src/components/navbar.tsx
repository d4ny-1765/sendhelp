import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  Box,
  Menu,
  MenuItem,
  ListItemText,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import userIcon from '../assets/user.png';
import { useAuth } from '../contexts/AuthContext';

interface Notification {
  id: number;
  type: 'new_post' | 'comment';
  section?: string;
  postTitle?: string;
  roomId?: string;
  commentText?: string;
}

const Navbar: React.FC = () => {

  const { auth, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleNotificationsClose = () => {
    setAnchorEl(null);
  };

  // Sample notifications (replace with backend call)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'new_post',
      section: 'Python',
      postTitle: 'How do I use decorators?',
      roomId: 'python-123',
    },
    {
      id: 2,
      type: 'comment',
      postTitle: 'Best way to handle promises in JS?',
      roomId: 'js-456',
      commentText: 'You could use async/await instead...',
    },
  ]);

  // Future hook to fetch real notifications
  // useEffect(() => {
  //   fetch('/api/notifications')
  //     .then((res) => res.json())
  //     .then(setNotifications);
  // }, []);

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

        {/ * Navigation buttons */}
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

        {/* Right: Notifications, Profile, Login */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleNotificationsClick} color="inherit" sx={{ ml: 1 }}>
            <NotificationsIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleNotificationsClose}
            MenuListProps={{
              'aria-labelledby': 'notifications-button',
            }}
          >
            {notifications.length > 0 ? (
              notifications.map((note) => {
                const link = `/room/${note.roomId}`;
                let text = '';

                if (note.type === 'new_post') {
                  text = `New post in ${note.section}: "${note.postTitle}"`;
                } else if (note.type === 'comment') {
                  text = `New comment on your post: "${note.commentText}"`;
                }

                return (
                  <MenuItem key={note.id} component={RouterLink} to={link} onClick={handleNotificationsClose}>
                    <ListItemText primary={text} />
                  </MenuItem>
                );
              })
            ) : (
              <MenuItem disabled>No new notifications</MenuItem>
            )}
          </Menu>

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
