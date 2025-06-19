const express = require('express');
require('dotenv').config();
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());

const path = require('path');
const cors = require('cors');

app.use(cors()); // Enable CORS
app.use(express.static(path.join(__dirname, 'frontend')));

app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const disasterRoutes = require('./routes/disaster');
app.use('/api/disasters', disasterRoutes);


const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);


const responderRoutes = require('./routes/responders');
app.use('/api/responders', responderRoutes);


const alertRoutes = require('./routes/alerts');
app.use('/api/alerts', alertRoutes);


const { updateResponderStatus } = require('./controllers/responseController');

app.use('/uploads', express.static('uploads'));
