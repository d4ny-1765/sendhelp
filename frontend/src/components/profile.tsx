import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Avatar,
  Container,
  CssBaseline,
  Divider,
  Alert
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import { useParams } from 'react-router-dom';

const defaultTheme = createTheme();

type ProfileData = {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

export const ProfilePage: React.FC = () => {
  const { hostId } = useParams<{ hostId: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({
    email: false,
    newPassword: false,
    confirmPassword: false
  });

  useEffect(() => {
    if (!hostId) return;
    fetch(`/api/v1/users/${hostId}`)
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(console.error);
  }, [hostId]);

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
      newPassword: showPasswordFields && (profile.newPassword?.length || 0) < 6,
      confirmPassword: showPasswordFields && profile.newPassword !== profile.confirmPassword
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // TODO: Implement API call to update profile
      console.log('Profile updated:', profile);
      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 3000);
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
          <Typography sx={{ fontFamily: 'Inter' }} component="h1" variant="h5">
            User Profile
          </Typography>
          
          {success && (
            <Alert severity="success" sx={{ width: '100%', mt: 2 }}>
              Profile updated successfully!
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
            {isEditing ? (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  value={profile.lastName}
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
                      helperText={errors.newPassword ? 'Password must be at least 6 characters' : ''}
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
                  {profile.firstName} {profile.lastName}
                </Typography>
                <Typography sx={{ fontFamily: 'Inter' }} variant="body1" gutterBottom>
                  {profile.email}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography sx={{ fontFamily: 'Inter' }} variant="body1">
                  {profile.bio}
                </Typography>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              </>
            )}
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}