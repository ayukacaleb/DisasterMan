const multer = require('multer');
const path = require('path');

// File storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// In your route:
router.post('/', authenticate, upload.single('photo'), async (req, res) => {
  const { type, severity, message, latitude, longitude } = req.body;
  const photo = req.file?.filename;

  try {
    const [result] = await pool.query(
      'INSERT INTO reports (user_id, type, severity, message, latitude, longitude, photo) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, type, severity, message, latitude, longitude, photo]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
