import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './components/home';
import RoomForm from './components/room_form';
import RoomDetail from './components/room_detail';
import { AuthProvider } from './contexts/AuthContext';
import LoginRegister from './components/login_register';
import { PrivateRoute } from './components/PrivateRoute';
import ProfilePage from './components/profile';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';


const App: React.FC = () => (
  <ThemeProvider theme={theme}>
  <AuthProvider>
    <BrowserRouter>
    <Navbar />
    <Routes>
    <Route path="/login" element={<LoginRegister />} />
    <Route path="/register" element={<LoginRegister />} />
      <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/room_form" element={<PrivateRoute><RoomForm /></PrivateRoute>} />
      <Route path="/rooms/:roomId" element={<PrivateRoute><RoomDetail /></PrivateRoute>} />
      <Route path='/profile' element={<PrivateRoute><ProfilePage /></PrivateRoute>} />  
    </Routes>
  </BrowserRouter>
  </AuthProvider>
  </ThemeProvider>
);

export default App;