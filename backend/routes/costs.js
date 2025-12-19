const router = require('express').Router();
const costController = require('../controllers/costController');
const auth = require('../middleware/auth');

router.post('/', auth, costController.createCalculation);
router.get('/', auth, costController.getCalculations);
router.post('/:id/analyze', auth, costController.analyzeCost);

module.exports = router;
