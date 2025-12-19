const router = require('express').Router();
const environmentalController = require('../controllers/environmentalController');
const auth = require('../middleware/auth');

// Analyze environmental conditions
// We can optionally protect this route, keeping it protected for consistency
router.post('/analyze', auth, environmentalController.analyze);

module.exports = router;
