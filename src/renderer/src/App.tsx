import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // Make sure the path is correct
import DashBoard from './pages/DashBoard';
import LocalStorage from './pages/localPasswords';
import {AuthProvider} from "./utils/AuthContext"
import { ThemeProvider } from './utils/ThemeContext';
import BreachReport from './pages/BreachReport';
import Settings from './pages/Settings';

function App(): JSX.Element {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashBoard />} />
            <Route path="/local-passwords" element={<LocalStorage />} />
            <Route path="/breach-report" element={<BreachReport />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>

  )
}

export default App;
