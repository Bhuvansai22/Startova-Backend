const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/upload
// @desc    Upload a file
// @access  Private
router.post('/', protect, upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Return the path relative to the server root, accessible via static route
        // Assuming server serves 'uploads' folder at '/uploads'
        const filePath = `/uploads/${req.file.filename}`;

        res.json({
            message: 'File uploaded successfully',
            filePath: filePath,
            fileName: req.file.originalname,
            fileSize: req.file.size
        });
    } catch (error) {
        console.error('Upload error:', error);
        // res.status(500).json({ error: 'File upload failed' });
    }
});

module.exports = router;
