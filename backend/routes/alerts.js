const router = require('express').Router();
const Alert = require('../models/Alert');
const auth = require('../middleware/auth');

// Get all alerts
router.get('/', auth, async (req, res) => {
    try {
        const alerts = await Alert.find({ user_id: req.user._id });
        res.json(alerts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create alert
router.post('/', auth, async (req, res) => {
    try {
        const newAlert = new Alert({
            ...req.body,
            user_id: req.user._id
        });
        const savedAlert = await newAlert.save();
        res.json(savedAlert);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mark as read
router.patch('/:id/read', auth, async (req, res) => {
    try {
        const updatedAlert = await Alert.findOneAndUpdate(
            { _id: req.params.id, user_id: req.user._id },
            { is_read: true },
            { new: true }
        );
        res.json(updatedAlert);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mark all as read
router.patch('/read-all', auth, async (req, res) => {
    try {
        await Alert.updateMany({ user_id: req.user._id }, { is_read: true });
        res.json({ message: 'All alerts marked as read' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete alert
router.delete('/:id', auth, async (req, res) => {
    try {
        await Alert.findOneAndDelete({ _id: req.params.id, user_id: req.user._id });
        res.json({ message: 'Alert deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Clear all alerts
router.delete('/', auth, async (req, res) => {
    try {
        await Alert.deleteMany({ user_id: req.user._id });
        res.json({ message: 'All alerts cleared' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
