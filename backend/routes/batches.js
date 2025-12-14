const router = require('express').Router();
const Batch = require('../models/Batch');
const auth = require('../middleware/auth');

// Get all batches
router.get('/', auth, async (req, res) => {
    try {
        const batches = await Batch.find({ user_id: req.user._id });
        res.json(batches);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create batch
router.post('/', auth, async (req, res) => {
    try {
        const newBatch = new Batch({
            ...req.body,
            user_id: req.user._id
        });
        const savedBatch = await newBatch.save();
        res.json(savedBatch);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update batch
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedBatch = await Batch.findOneAndUpdate(
            { _id: req.params.id, user_id: req.user._id },
            req.body,
            { new: true }
        );
        if (!updatedBatch) return res.status(404).json({ error: 'Batch not found' });
        res.json(updatedBatch);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete batch
router.delete('/:id', auth, async (req, res) => {
    try {
        const deletedBatch = await Batch.findOneAndDelete({ _id: req.params.id, user_id: req.user._id });
        if (!deletedBatch) return res.status(404).json({ error: 'Batch not found' });
        res.json({ message: 'Batch deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
