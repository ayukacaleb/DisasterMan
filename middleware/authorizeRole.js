const authorizeRole = (role) => (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
    next();
  };
  
  module.exports = authorizeRole;

  




//   const authorizeRole = require('../middleware/authorizeRole');

// router.post('/admin-only', authenticateToken, authorizeRole('admin'), (req, res) => {
//   res.send('Only admins can see this');
// });
