const pool = require('../config/db');

exports.reportDisaster = async (req, res) => {
  const { type, severity, message, latitude, longitude } = req.body;
  const userId = req.user.id;

  // Basic validation
  const allowedTypes = ['Fire', 'Flood', 'Earthquake', 'Tornado', 'Other'];
  const allowedSeverities = ['Low', 'Medium', 'High', 'Critical'];

  if (!allowedTypes.includes(type) || !allowedSeverities.includes(severity)) {
    return res.status(400).json({ error: 'Invalid disaster type or severity level' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO disaster_reports (user_id, type, severity, message, latitude, longitude)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, type, severity, message, latitude, longitude]
    );

    res.status(201).json({ message: 'Disaster reported successfully', reportId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
