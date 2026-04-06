import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import HomePage        from './pages/HomePage';
import LoginPage       from './pages/LoginPage';
import SignupPage      from './pages/SignupPage';
import DashboardPage   from './pages/DashboardPage';
import MedicinePage    from './pages/MedicinePage';
import TelemedicinePage from './pages/TelemedicinePage';
import ActivityPage    from './pages/ActivityPage';
import DocumentsPage   from './pages/DocumentsPage';
import EntertainmentPage from './pages/EntertainmentPage';
import ContactsPage    from './pages/ContactsPage';

import Layout          from './components/Layout';
import SOSButton       from './components/SOSButton';
import VoiceAssistant  from './components/VoiceAssistant';

export const AuthContext = React.createContext(null);

export default function App() {
  const [user, setUser] = useState(null);
  const [voiceOpen, setVoiceOpen] = useState(false);

  const login  = (u) => setUser(u);
  const logout = ()  => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/"       element={<HomePage />} />
          <Route path="/login"  element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected — wrapped in Layout */}
          <Route element={<Layout onVoice={() => setVoiceOpen(true)} />}>
            <Route path="/dashboard"    element={user ? <DashboardPage />    : <Navigate to="/login" />} />
            <Route path="/medicine"     element={user ? <MedicinePage />     : <Navigate to="/login" />} />
            <Route path="/telemedicine" element={user ? <TelemedicinePage /> : <Navigate to="/login" />} />
            <Route path="/activity"     element={user ? <ActivityPage />     : <Navigate to="/login" />} />
            <Route path="/documents"    element={user ? <DocumentsPage />    : <Navigate to="/login" />} />
            <Route path="/entertainment"element={user ? <EntertainmentPage />: <Navigate to="/login" />} />
            <Route path="/contacts"     element={user ? <ContactsPage />     : <Navigate to="/login" />} />
          </Route>
        </Routes>

        {/* Global always-visible elements */}
        {user && <SOSButton />}
        {user && <VoiceAssistant open={voiceOpen} onClose={() => setVoiceOpen(false)} />}
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
