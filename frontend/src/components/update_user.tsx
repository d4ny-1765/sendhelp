import React, { useState } from 'react';
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

const defaultTheme = createTheme();

type UserData = {
  firstName: string;
  lastName: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function UpdateUserProfile() {
  const [userData, setUserData] = useState<UserData>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({
    email: false,
    newPassword: false,
    confirmPassword: false
  });
  
  const [success, setSuccess] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {
      email: !/^\S+@\S+\.\S+$/.test(userData.email),
      newPassword: showPasswordFields && userData.newPassword.length < 6,
      confirmPassword: showPasswordFields && userData.newPassword !== userData.confirmPassword
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Profile updated:', userData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Paper elevation={3} sx={{ mt: 4, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 80, height: 80 }}>
            <PersonIcon fontSize="large" />
          </Avatar>
          <Typography component="h1" variant="h5">
            Update Profile
          </Typography>
          
          {success && (
            <Alert severity="success" sx={{ width: '100%', mt: 2 }}>
              Profile updated successfully!
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="firstName"
              label="First Name"
              name="firstName"
              value={userData.firstName}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              value={userData.lastName}
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
              value={userData.email}
              onChange={handleChange}
              error={errors.email}
              helperText={errors.email ? 'Please enter a valid email' : ''}
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
                  id="currentPassword"
                  value={userData.currentPassword}
                  onChange={handleChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="newPassword"
                  label="New Password"
                  type="password"
                  id="newPassword"
                  value={userData.newPassword}
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
                  id="confirmPassword"
                  value={userData.confirmPassword}
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
              Save Changes
            </Button>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}