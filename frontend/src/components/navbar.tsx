import React, { useState, useEffect, useCallback } from 'react';
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
import { apiFetch } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

interface Notification {
  id: number;
  type: 'new_post' | 'comment' | 'followed_post' | 'new_room';
  section?: string;
  postTitle?: string;
  roomId?: string;
  commentText?: string;
  userId?: string;
  userName?: string;
  roomName?: string;
  createdAt?: string;
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

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationError, setNotificationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!auth) return;
    
    try {
      setIsLoading(true);
      const response = await apiFetch(`/api/v1/following/${auth.user.userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const rooms = await response.json();
      // Convert rooms to notifications format
      const notifications: Notification[] = rooms.map((room: any) => ({
        id: room.roomId,
        type: 'new_room',
        roomId: room.roomId,
        userName: room.hostName,
        roomName: room.name,
        createdAt: room.createdAt
      }));
      
      setNotifications(notifications);
      setNotificationError(null);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotificationError('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  }, [auth]);

  useEffect(() => {
    fetchNotifications();
    
    // Poll for new notifications every 30 seconds
    const intervalId = setInterval(fetchNotifications, 30000);

    return () => clearInterval(intervalId);
  }, [fetchNotifications]);

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary',
        py: 1
      }}
    >
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
          Stack Rant
        </Typography>

        {/* Navigation buttons */}
        

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
          {auth && (
            <>
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
                {isLoading ? (
                  <MenuItem disabled>Loading notifications...</MenuItem>
                ) : notificationError ? (
                  <MenuItem disabled>{notificationError}</MenuItem>
                ) : notifications.length > 0 ? (
                  notifications.map((note) => {
                    const link = `/rooms/${note.roomId}`;
                    let text = '';

                    if (note.type === 'new_room') {
                      text = `${note.userName} created room: "${note.roomName}"`;
                    }

                    return (
                      <MenuItem key={note.id} component={RouterLink} to={link} onClick={handleNotificationsClose}>
                        <ListItemText 
                          primary={text}
                          secondary={note.createdAt ? new Date(note.createdAt).toLocaleString() : ''}
                        />
                      </MenuItem>
                    );
                  })
                ) : (
                  <MenuItem disabled>No new rooms from followed users</MenuItem>
                )}
              </Menu>
            </>
          )}

          <IconButton component={RouterLink} to="/profile" sx={{ p: 0, ml: 2 }}>
            <Avatar
              src={userIcon}
              alt="Profile"
              sx={{ width: 36, height: 36 }}
            />
          </IconButton>
          {auth ? (
            
            <Button color="inherit" onClick={logout} sx={{ ml: 2 }}>
              Logout
            </Button>
          ) : (
            <Button component={RouterLink} to="/login" color="inherit" sx={{ ml: 2 }}>
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
