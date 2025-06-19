const pool = require('../config/db');

exports.createAlert = async (req, res) => {
  const { title, message } = req.body;
  const adminId = req.user.id;

  if (!title || !message) {
    return res.status(400).json({ error: 'Title and message are required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO alerts (title, message, created_by) VALUES (?, ?, ?)',
      [title, message, adminId]
    );
    res.status(201).json({ message: 'Alert sent successfully', alertId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllAlerts = async (req, res) => {
  try {
    const [alerts] = await pool.query(`
      SELECT 
        a.id, a.title, a.message, a.created_at,
        u.username AS created_by
      FROM alerts a
      LEFT JOIN users u ON a.created_by = u.id
      ORDER BY a.created_at DESC
    `);
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
