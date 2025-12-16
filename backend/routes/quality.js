const router = require('express').Router();
const qualityController = require('../controllers/qualityController');
const { createQualityUploadSchema } = require('../validators/qualityValidator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const upload = require('../utils/upload');

// Upload image and create record
// Note: 'upload.single' handles the multipart parsing.
// 'validate' would run on req.body AFTER multer has processed it.
router.post('/', auth, upload.single('image'), validate(createQualityUploadSchema), qualityController.createUpload);

// Get all uploads
router.get('/', auth, qualityController.getAllUploads);

// Delete upload
router.delete('/:id', auth, qualityController.deleteUpload);

module.exports = router;
