const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;


app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`; 
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|pdf/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDFs are allowed!'));
    }
  },
});

app.post('/uploads', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ error: 'No file uploaded' });
  }

  res.status(200).send({
    fileName: req.file.filename,
    filePath: `/uploads/${req.file.filename}`,
    fileSize: req.file.size,
    fileType: req.file.mimetype,
  });
});


app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(400).send({ error: err.message });
  } else if (err) {
    res.status(400).send({ error: err.message });
  } else {
    next();
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`); 
});