import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import Login from './pages/Login';
import Register from './pages/Register';
import Client from './pages/Client';
import Manager from './pages/Manager';
import TeamLead from './pages/TeamLead';
import TeamMember from './pages/TeamMember';

function App() {
  const [requests, setRequests] = useState([]);

  const addRequest = (text) => {
    const newRequest = {
      id: Date.now(),
      text,
      status: 'pending',
      progress: 'Not Started',
    };
    setRequests(prev => [...prev, newRequest]);
  };

  const updateStatus = (id, status) => {
    setRequests(prev =>
      prev.map(req => req.id === id ? { ...req, status } : req)
    );
  };

  const updateProgress = (id, progress) => {
    setRequests(prev =>
      prev.map(req => req.id === id ? { ...req, progress } : req)
    );
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/client" element={<Client requests={requests} addRequest={addRequest} />} />
        <Route path="/manager" element={<Manager requests={requests} updateStatus={updateStatus} updateProgress={updateProgress} />} />
        <Route path="/teamlead" element={<TeamLead requests={requests} updateStatus={updateStatus} updateProgress={updateProgress} />} />
        <Route path="/teammember" element={<TeamMember requests={requests} updateStatus={updateStatus} updateProgress={updateProgress} />} />
      </Routes>
    </>
  );
}

export default App;