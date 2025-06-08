const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const importSeriesFromJSON = require('../services/importSeriesFromJSON');

const upload = multer({ dest: 'uploads/' });

router.post('/import-series', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Brak pliku JSON w żądaniu.' });
    }

    const filePath = path.resolve(req.file.path);
    await importSeriesFromJSON(filePath);

    res.status(200).json({ message: 'Seriale zaimportowane z JSON.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Błąd importu seriali.', error: error.message });
  }
});

module.exports = router;