const express = require('express');
const { reportDisaster } = require('../controllers/disasterController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/report', authenticateToken, reportDisaster);

module.exports = router;
