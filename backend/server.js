const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BusLocation = require('./models/BusLocation'); 
const Student = require('./models/Student');
const Admin = require('./models/Admin');
const morgan = require('morgan');

const app = express();
const port = 3000;
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
const USER_NAME='ankit_saini85';
const PASSWORD='ankit7500057688';
const DB_NAME='bus_tracking';

// MongoDB connection
mongoose.connect(`mongodb+srv://${USER_NAME}:${PASSWORD}@merncluster.2k4wx.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=merncluster`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
  
  
  // User Schema
  const userSchema = new mongoose.Schema({
    busNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    route: { type: String, required: true }
  });
  const User = mongoose.model('User', userSchema);
  
// API to register admin
app.post('/admin/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ name, email, password: hashedPassword });
    await newAdmin.save();
    res.status(200).send('Admin registered successfully');
  } catch (err) {
    console.error('Error registering admin:', err);
    res.status(500).send('Error registering admin');
  }
});
// API to login admin
app.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (admin && await bcrypt.compare(password, admin.password)) {
      const token = jwt.sign({ email: admin.email }, 'secret_key');
      res.json({ token });
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    console.error('Error logging in admin:', error);
    res.status(500).send('Error logging in admin');
  }
});

  // API to register student
app.post('/student/register', async (req, res) => {
  const { name, number, studentId, email, class: studentClass, route, photo } = req.body;
  if (!name || !number || !studentId || !email || !studentClass || !route || !photo) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newStudent = new Student({ name, number, studentId, email, class: studentClass, route, photo });
    await newStudent.save();
    res.status(200).send('Student registered successfully');
  } catch (err) {
    console.error('Error registering student:', err);
    res.status(500).send('Error registering student');
  }
});


// API to register user
app.post('/register', async (req, res) => {
  console.log("hello");
  const { busNumber, password,route } = req.body;
  if (!busNumber || !password || !route) {
    return res.status(400).json({ message: 'Bus number , password and route are required' });
  }

  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      busNumber,
      password: hashedPassword,
      route,
    });

    await newUser.save();
    console.log('User registered:', newUser);
    res.status(200).send('User registered successfully');
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).send('Error registering user');
  }
});

// API to login user
app.post('/login', async (req, res) => {
  const { busNumber, password } = req.body;
  try {
    const user = await User.findOne({ busNumber });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ bus: user.busNumber }, 'secret_key');
      res.json({ token });
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).send('Error logging in user');
  }
});

// Middleware to authenticate user
const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (token) {
    jwt.verify(token.split(' ')[1], 'secret_key', (err, decoded) => {
      if (err) {
        return res.status(401).send('Invalid token');
      } else {
        console.log('Decoded token:', decoded); // Log the decoded token
        req.busNumber = decoded.bus; // Ensure this matches the token payload
        console.log('Bus number set to:', req.busNumber); // Log the bus number
        next();
      }
    });
  } else {
    res.status(401).send('No token provided');
  }
};
app.post('/update-location', authenticate, async (req, res) => {
  const { latitude, longitude } = req.body;

  try {
    // Check if a location entry already exists for the bus number
    let busLocation = await BusLocation.findOne({ busNumber: req.busNumber });

    if (busLocation) {
      // Update existing location
      busLocation.latitude = latitude;
      busLocation.longitude = longitude;
      await busLocation.save();
      res.send('Location updated');
    } else {
      // Create new location
      busLocation = new BusLocation({ busNumber: req.busNumber, latitude, longitude });
      await busLocation.save();
      res.json({ message: 'Location created', locationId: busLocation._id });
    }
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).send('Error updating location');
  }
});

// API to get bus location by bus number
app.get('/bus-location/:busNumber', async (req, res) => {
  const { busNumber } = req.params;
  const busLocation = await BusLocation.findOne({ busNumber }).sort({ timestamp: -1 });
  res.json(busLocation);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});