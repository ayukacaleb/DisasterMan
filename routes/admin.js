const express = require('express');
const { getAllReports, getSingleReport } = require('../controllers/adminController');
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/authorizeRole');

const router = express.Router();

// Admin-only access
router.get('/reports', authenticateToken, authorizeRole('admin'), getAllReports);
router.get('/reports/:id', authenticateToken, authorizeRole('admin'), getSingleReport);

module.exports = router;
