const router = require('express').Router();
const alertController = require('../controllers/alertController');
const { createAlertSchema } = require('../validators/alertValidator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

// Get all alerts
router.get('/', auth, alertController.getAllAlerts);

// Create alert
router.post('/', auth, validate(createAlertSchema), alertController.createAlert);

// Mark as read
router.patch('/:id/read', auth, alertController.markAsRead);

// Mark all as read
router.patch('/read-all', auth, alertController.markAllAsRead);

// Delete alert
router.delete('/:id', auth, alertController.deleteAlert);

// Clear all alerts
router.delete('/', auth, alertController.clearAllAlerts);

module.exports = router;
