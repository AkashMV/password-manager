import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // Make sure the path is correct
import DashBoard from './pages/DashBoard';
import LocalStorage from './pages/localPasswords';
import {AuthProvider} from "./utils/AuthContext"

function App(): JSX.Element {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/local-passwords" element={<LocalStorage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
