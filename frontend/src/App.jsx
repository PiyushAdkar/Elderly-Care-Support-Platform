import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar          from './components/Navbar';
import HomePage        from './pages/HomePage';
import LoginPage       from './pages/LoginPage';
import SignupPage      from './pages/SignupPage';
import About           from './pages/About';
import DashboardPage   from './pages/DashboardPage';
import MedicinePage    from './pages/MedicinePage';
import TelemedicinePage from './pages/TelemedicinePage';
import ActivityPage    from './pages/ActivityPage';
import DocumentsPage   from './pages/DocumentsPage';
import EntertainmentPage from './pages/EntertainmentPage';
import ContactsPage    from './pages/ContactsPage';

import Layout          from './components/Layout';
import SOSButton       from './components/SOSButton';

import { AuthContext } from './context/AuthContext';

export default function App() {
  const { isAuthenticated, user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"       element={<><Navbar /><HomePage /></>} />
        <Route path="/about"  element={<><Navbar /><About /></>} />
        <Route path="/login"  element={<><Navbar /><LoginPage /></>} />
        <Route path="/signup" element={<><Navbar /><SignupPage /></>} />

        {/* Protected — wrapped in Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard"    element={isAuthenticated ? <DashboardPage />    : <Navigate to="/login" />} />
          <Route path="/medicine"     element={isAuthenticated ? <MedicinePage />     : <Navigate to="/login" />} />
          <Route path="/telemedicine" element={isAuthenticated ? <TelemedicinePage /> : <Navigate to="/login" />} />
          <Route path="/activity"     element={isAuthenticated ? <ActivityPage />     : <Navigate to="/login" />} />
          <Route path="/documents"    element={isAuthenticated ? <DocumentsPage />    : <Navigate to="/login" />} />
          <Route path="/entertainment"element={isAuthenticated ? <EntertainmentPage />: <Navigate to="/login" />} />
          <Route path="/contacts"     element={isAuthenticated ? <ContactsPage />     : <Navigate to="/login" />} />
        </Route>
      </Routes>

      {/* Global always-visible elements */}
      {isAuthenticated && <SOSButton />}
    </BrowserRouter>
  );
}
