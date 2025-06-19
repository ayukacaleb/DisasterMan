const pool = require('../config/db');

// Calculate distance (Haversine formula)
function getDistance(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => deg * (Math.PI / 180);
  const R = 6371; // km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

exports.assignResponder = async (req, res) => {
  const { disasterId } = req.params;

  try {
    const [[disaster]] = await pool.query('SELECT * FROM disaster_reports WHERE id = ?', [disasterId]);
    if (!disaster) return res.status(404).json({ error: 'Disaster not found' });

    // Get available responders
    const [responders] = await pool.query('SELECT * FROM responders WHERE is_available = 1');

    if (responders.length === 0) {
      return res.status(400).json({ error: 'No available responders' });
    }

    // Find nearest responder
    let closest = null;
    let minDistance = Infinity;

    responders.forEach((r) => {
      const distance = getDistance(disaster.latitude, disaster.longitude, r.latitude, r.longitude);
      if (distance < minDistance) {
        minDistance = distance;
        closest = r;
      }
    });

    // Assign the closest responder
    await pool.query('INSERT INTO disaster_response (disaster_id, responder_id) VALUES (?, ?)', [
      disasterId,
      closest.id,
    ]);

    // Set responder to unavailable
    await pool.query('UPDATE responders SET is_available = 0 WHERE id = ?', [closest.id]);

    res.status(200).json({
      message: 'Responder assigned successfully',
      responder: closest,
      distance_km: minDistance.toFixed(2)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateResponderStatus = async (req, res) => {
  const { disasterId, responderId } = req.params;
  const { status } = req.body;

  const allowedStatuses = ['Assigned', 'On Site', 'Resolved'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Allowed values are Assigned, On Site, Resolved.' });
  }

  try {
    // Update status of the responder for the specific disaster report
    const [result] = await pool.query(
      'UPDATE disaster_response SET status = ? WHERE disaster_id = ? AND responder_id = ?',
      [status, disasterId, responderId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Responder not assigned to this disaster' });
    }

    res.status(200).json({ message: 'Responder status updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
