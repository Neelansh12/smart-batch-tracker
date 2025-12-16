const router = require('express').Router();
const authController = require('../controllers/authController');
const { registerSchema, loginSchema, updateProfileSchema } = require('../validators/authValidator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

// Register
router.post('/register', validate(registerSchema), authController.register);

// Login
router.post('/login', validate(loginSchema), authController.login);

// Get Current User
router.get('/me', auth, authController.getCurrentUser);

// Update user profile
router.put('/me', auth, validate(updateProfileSchema), authController.updateProfile);

module.exports = router;
