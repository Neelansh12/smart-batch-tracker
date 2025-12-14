const router = require('express').Router();
const QualityUpload = require('../models/QualityUpload');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Upload image and create record
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        // Create QualityUpload record (mocking AI analysis for now)
        const newUpload = new QualityUpload({
            user_id: req.user._id,
            batch_id: req.body.batch_id,
            image_url: imageUrl,
            quality_score: Math.floor(Math.random() * 20) + 80, // Mock scores
            freshness_score: Math.floor(Math.random() * 20) + 80,
            defect_score: Math.floor(Math.random() * 10),
            ai_analysis: 'Automated analysis pending integration',
            notes: req.body.notes
        });

        const savedUpload = await newUpload.save();
        res.json(savedUpload);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const uploads = await QualityUpload.find({ user_id: req.user._id });
        res.json(uploads);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete upload
router.delete('/:id', auth, async (req, res) => {
    try {
        await QualityUpload.findOneAndDelete({ _id: req.params.id, user_id: req.user._id });
        // NOTE: In a real app, also delete the file from filesystem
        res.json({ message: 'Upload deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
