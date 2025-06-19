const pool = require('../config/db');

exports.getAllReports = async (req, res) => {
  try {
    const [reports] = await pool.query(`
      SELECT 
        dr.id, dr.type, dr.severity, dr.message, dr.latitude, dr.longitude, dr.reported_at,
        u.username AS reported_by
      FROM disaster_reports dr
      JOIN users u ON dr.user_id = u.id
      ORDER BY dr.reported_at DESC
    `);
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSingleReport = async (req, res) => {
  const reportId = req.params.id;
  try {
    const [reports] = await pool.query(`
      SELECT 
        dr.*, u.username AS reported_by
      FROM disaster_reports dr
      JOIN users u ON dr.user_id = u.id
      WHERE dr.id = ?
    `, [reportId]);

    if (!reports.length) return res.status(404).json({ message: 'Report not found' });

    res.json(reports[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
