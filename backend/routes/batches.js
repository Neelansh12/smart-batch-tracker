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
            user_id: req.user._id,
            timeline: [{
                status: req.body.status || 'inbound',
                notes: 'Batch created',
                user_id: req.user._id,
                timestamp: new Date()
            }]
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
        const batch = await Batch.findOne({ _id: req.params.id, user_id: req.user._id });
        if (!batch) return res.status(404).json({ error: 'Batch not found' });

        // Check for status change
        if (req.body.status && req.body.status !== batch.status) {
            batch.timeline.push({
                status: req.body.status,
                notes: req.body.notes || `Status updated to ${req.body.status}`,
                user_id: req.user._id,
                timestamp: new Date()
            });
        }

        // Update fields
        Object.assign(batch, req.body);
        batch.updated_at = Date.now();

        const updatedBatch = await batch.save();
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
