import React, { useState } from 'react';
import axios from 'axios';

const StudentRegister = () => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [route, setRoute] = useState('');
  const [photo, setPhoto] = useState('');

  const handlePhotoCapture = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const register = async () => {
    try {
      await axios.post('http://192.168.159.134:3000/student/register', { name, number, studentId, email, class: studentClass, route, photo });
      alert('Student registered successfully');
    } catch (error) {
      alert('Registration failed');
    }
  };

  return (
    <div>
      <h2>Student Register</h2>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="Number" value={number} onChange={(e) => setNumber(e.target.value)} />
      <input type="text" placeholder="Student ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="text" placeholder="Class" value={studentClass} onChange={(e) => setStudentClass(e.target.value)} />
      <input type="text" placeholder="Route" value={route} onChange={(e) => setRoute(e.target.value)} />
      <input type="file" accept="image/*" onChange={handlePhotoCapture} />
      <button onClick={register}>Register</button>
    </div>
  );
};

export default StudentRegister;