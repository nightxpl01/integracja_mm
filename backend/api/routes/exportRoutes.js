const express = require('express');
const router = express.Router();
const exportUserMedia = require('../services/exportUserMedia');

router.get('/export-user-media/:userId', async (req, res) => {
  const { userId } = req.params;
  const { format = 'json' } = req.query;

  try {
    console.log(`Export request for userId=${userId}, format=${format}`);
    const filePath = await exportUserMedia(userId, format);
    console.log(`File generated: ${filePath}`);
    res.download(filePath);
  } catch (error) {
    console.error('Export failed:', error);
    res.status(500).json({ message: 'Export failed.', error: error.message });
  }
});

module.exports = router;