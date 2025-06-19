const express = require('express');
const { assignResponder, updateResponderStatus } = require('../controllers/responseController'); // Import both functions
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/authorizeRole');

const router = express.Router();  // Declare router once

// Admin-only route for assigning responders
router.post('/assign/:disasterId', authenticateToken, authorizeRole('admin'), assignResponder);

// Admin-only route for updating responder status for a specific disaster
router.put('/status/:disasterId/:responderId', authenticateToken, authorizeRole('admin'), updateResponderStatus);

module.exports = router;  // Export router
