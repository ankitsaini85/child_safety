import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import AdminRegister from './AdminRegister';
import StudentRegister from './StudentRegister';

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/login" element={<AdminLogin onLogin={() => setIsAdminLoggedIn(true)} />} />
        {isAdminLoggedIn ? (
          <Route path="/student/register" element={<StudentRegister />} />
        ) : (
          <Route path="*" element={<Navigate to="/admin/login" />} />
        )}
        <Route path="/" element={
          <div>
            <h1>Welcome to the Admin Portal</h1>
            <a href="/admin/register">Register Admin</a>
            <br />
            <a href="/admin/login">Login Admin</a>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;