const express = require('express');
const { createAlert, getAllAlerts } = require('../controllers/alertController');
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/authorizeRole');

const router = express.Router();

// User access to alerts
router.get('/', authenticateToken, getAllAlerts);

// Admin access to send alerts
router.post('/', authenticateToken, authorizeRole('admin'), createAlert);

module.exports = router;
