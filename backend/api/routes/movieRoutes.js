const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const importMoviesFromXML = require('../services/importMoviesFromXML');

const upload = multer({ dest: 'uploads/' });

router.post('/import-movies', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Brak pliku w żądaniu.' });
    }

    const filePath = path.resolve(req.file.path);
    await importMoviesFromXML(filePath); 

    res.status(200).json({ message: 'Filmy zaimportowane z XML.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Błąd importu filmów.', error: error.message });
  }
});

module.exports = router;
