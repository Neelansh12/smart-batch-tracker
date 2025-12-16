const router = require('express').Router();
const batchController = require('../controllers/batchController');
const { createBatchSchema, updateBatchSchema } = require('../validators/batchValidator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

// Get all batches
router.get('/', auth, batchController.getAllBatches);

// Create batch
router.post('/', auth, validate(createBatchSchema), batchController.createBatch);

// Update batch
router.put('/:id', auth, validate(updateBatchSchema), batchController.updateBatch);

// Delete batch
router.delete('/:id', auth, batchController.deleteBatch);

module.exports = router;
