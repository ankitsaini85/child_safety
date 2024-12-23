const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // Import cors
const app = express();

app.use(bodyParser.json());
app.use(cors()); // Use cors middleware

mongoose.connect('mongodb+srv://exclusiveabhi:maCdjaRpoWvGczS5@cluster0.5c95a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  busNumber: String,
  password: String,
  route: String,
});

const locationSchema = new mongoose.Schema({
  busNumber: String,
  latitude: Number,
  longitude: Number,
  timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Location = mongoose.model('Location', locationSchema);

// Register endpoint
app.post('/register', async (req, res) => {
  const { busNumber, password, route } = req.body;
  try {
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

// Login endpoint
app.post('/login', async (req, res) => {
  const { busNumber, password } = req.body;
  try {
    const user = await User.findOne({ busNumber });
    if (!user) {
      return res.status(400).send('Bus number not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send('Invalid password');
    }

    const token = jwt.sign({ busNumber: user.busNumber }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token, route: user.route });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).send('Error logging in');
  }
});

// Get bus location by bus number
app.get('/bus-location/:busNumber', async (req, res) => {
  const { busNumber } = req.params;
  try {
    const busLocation = await Location.findOne({ busNumber }).sort({ timestamp: -1 });
    if (busLocation) {
      res.json(busLocation);
    } else {
      res.status(404).send({ message: 'Bus not found' });
    }
  } catch (err) {
    console.error('Error fetching bus location:', err);
    res.status(500).send('Error fetching bus location');
  }
});

// Track bus location
app.post('/track', async (req, res) => {
  const { busNumber, latitude, longitude } = req.body;
  try {
    const location = await Location.findOneAndUpdate(
      { busNumber },
      { latitude, longitude, timestamp: new Date() },
      { upsert: true, new: true }
    );
    res.send({ message: 'Location updated', location });
  } catch (err) {
    console.error('Error updating location:', err);
    res.status(500).send('Error updating location');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});