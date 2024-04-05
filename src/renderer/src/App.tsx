import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // Make sure the path is correct
import DashBoard from './pages/DashBoard';

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashBoard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
