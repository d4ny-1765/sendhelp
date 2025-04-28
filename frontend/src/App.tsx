import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './components/home';
import RoomForm from './components/room_form';
import RoomDetail from './components/room_detail';

const App: React.FC = () => (
  <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/room_form" element={<RoomForm />} />
      <Route path="/rooms/:roomId" element={<RoomDetail />} />
      
    </Routes>
  </BrowserRouter>
);

export default App;