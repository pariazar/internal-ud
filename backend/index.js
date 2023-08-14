const express = require('express');
const multer = require('multer');
const cors = require('cors'); // Import the cors package

const path = require('path');

const app = express();
const port = 3000;
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow any origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Specify allowed methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Specify allowed headers
  next();
});

// Set up the static files serving from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

// Endpoint for uploading files
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  res.json({
    message: 'File uploaded successfully.',
    filename: req.file.filename,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
