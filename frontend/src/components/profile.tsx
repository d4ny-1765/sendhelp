import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Alert, 
  Typography, 
  List, 
  ListItem, 
  ListItemText,
  Container,
  CssBaseline,
  Paper,
  Avatar,
  Divider,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../contexts/AuthContext'; 
import { apiFetch } from '../utils/api';

const defaultTheme = createTheme();



type ProfileData = {
  id: number;
  name: string;
  email: string;
  bio: string;
  followers: number;
  following: number;
  isFollowing?: boolean;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

export const ProfilePage: React.FC = () => {
  const { userId } = useAuth();
  const { userId: currentUserId } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    email: false,
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });
  const [dialogType, setDialogType] = useState<'followers' | 'following' | null>(null);
  const [dialogUsers, setDialogUsers] = useState<Array<{ id: string, name: string }>>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      
      try {
        const data = await apiFetch(`/api/v1/users/${userId}`);
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleFollow = async () => {
    if (!userId || !currentUserId) return;
    
    try {
      if (isFollowing) {
        await apiFetch(`/api/v1/users/${userId}/follow`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ followerId: currentUserId })
        });
        setIsFollowing(false);
      } else {
        await apiFetch(`/api/v1/users/${userId}/follow`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ followerId: currentUserId })
        });
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Failed to follow/unfollow:', error);
    }
  };

  const handleOpenDialog = async (type: 'followers' | 'following') => {
    if (!userId) return;
  
    try {
      const endpoint = type === 'followers' 
        ? `/api/v1/followers/${userId}`
        : `/api/v1/following/${userId}`;
        
      const users = await apiFetch(endpoint);
      setDialogUsers(users.map((user: any) => ({
        id: user.userId,
        name: user.name
      })));
      setDialogType(type);
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      setApiError(`Failed to load ${type}`);
    }
  };

  if (apiError) {
    return <Typography color="error">{apiError}</Typography>;
  }

  if (!profile) {
    return <Typography>Loading profile...</Typography>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => prev ? {
      ...prev,
      [name]: value
    } : null);
  };

  const validateForm = () => {
    if (!profile) return false;
    const newErrors = {
      email: !/^\S+@\S+\.\S+$/.test(profile.email),
      currentPassword: showPasswordFields && !profile.currentPassword,
      newPassword: showPasswordFields && (
        !profile.newPassword ||
        profile.newPassword.length < 6 ||
        profile.newPassword.length > 50
      ),
      confirmPassword: showPasswordFields && (
        !profile.confirmPassword ||
        profile.confirmPassword !== profile.newPassword
      )
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const updatedProfile = await apiFetch(`/api/v1/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          bio: profile.bio,
          ...(showPasswordFields && {
            currentPassword: profile.currentPassword,
            newPassword: profile.newPassword,
            confirmPassword: profile.confirmPassword,
          }),
        }),
      });

      setProfile(updatedProfile);
      setSuccess(true);
      setIsEditing(false);
      setShowPasswordFields(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      console.error(error);
      setApiError(error.message || 'Failed to update profile');
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container sx={{ backgroundColor: '#daddd8', borderRadius: 2, boxShadow: 3, p: 3 }} component="main" maxWidth="sm">
        <CssBaseline />
        <Paper elevation={3} sx={{ mt: 4, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 80, height: 80 }}>
            <PersonIcon fontSize="large" />
          </Avatar>
          <Typography variant="h6" component="div">
            {profile.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {profile.bio}
          </Typography>
          {apiError && (
            <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
              {apiError}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ width: '100%', mt: 2 }}>
              Profile updated successfully!
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
            <Button 
variant="outlined" 
              onClick={() => handleOpenDialog('followers')}
>
              Followers
            </Button>
            <Button 
variant="outlined" 
              onClick={() => handleOpenDialog('following')}
>
              Following
            </Button>
            {userId !== currentUserId && (
              <Button
                variant={isFollowing ? "outlined" : "contained"}
                onClick={handleFollow}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            )}
          </Box>

          <Dialog 
            open={dialogType !== null} 
            onClose={() => setDialogType(null)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              {dialogType === 'followers' ? 'Followers' : 'Following'}
            </DialogTitle>
            <DialogContent>
              <List>
                {dialogUsers.map(user => (
                  <ListItem key={user.id}>
                    <ListItemText primary={user.name} />
                  </ListItem>
                ))}
              </List>
            </DialogContent>
          </Dialog>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
            {isEditing ? (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="firstName"
                  label="Name"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                  error={errors.email}
                  helperText={errors.email ? 'Please enter a valid email' : ''}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="bio"
                  label="Bio"
                  name="bio"
                  multiline
                  rows={4}
                  value={profile.bio}
                  onChange={handleChange}
                />

                {!showPasswordFields ? (
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{ mt: 2 }}
                    onClick={() => setShowPasswordFields(true)}
                  >
                    Change Password
                  </Button>
                ) : (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1">Change Password</Typography>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="currentPassword"
                      label="Current Password"
                      type="password"
                      value={profile.currentPassword || ''}
                      onChange={handleChange}
                      error={errors.currentPassword}
                      helperText={errors.currentPassword ? 'Please enter your current password' : ''}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="newPassword"
                      label="New Password"
                      type="password"
                      value={profile.newPassword || ''}
                      onChange={handleChange}
                      error={errors.newPassword}
                      helperText={errors.newPassword ? 'Password must be 6-50 characters' : ''}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="confirmPassword"
                      label="Confirm New Password"
                      type="password"
                      value={profile.confirmPassword || ''}
                      onChange={handleChange}
                      error={errors.confirmPassword}
                      helperText={errors.confirmPassword ? 'Passwords do not match' : ''}
                    />
                  </>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Save Profile
                </Button>
              </>
            ) : (
              <>
                <Typography sx={{ fontFamily: 'Inter' }} variant="h6" gutterBottom>
                  {profile.name}
                </Typography>
                <Typography sx={{ fontFamily: 'Inter' }} variant="body1" gutterBottom>
                  {profile.email}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography sx={{ fontFamily: 'Inter' }} variant="body1">
                  {profile.bio}
                </Typography>
              </>
            )}
          </Box>
          {isEditing ? null : (
            <Button
              fullWidth
              variant="outlined"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default ProfilePage;
