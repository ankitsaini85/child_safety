import React, { useState } from 'react';
import axios from 'axios';

const AdminRegister = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const register = async () => {
    try {
      await axios.post('http://192.168.159.134:3000/admin/register', { name, email, password });
      alert('Admin registered successfully');
    } catch (error) {
      alert('Registration failed');
    }
  };

  return (
    <div>
      <h2>Admin Register</h2>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={register}>Register</button>
    </div>
  );
};

export default AdminRegister;