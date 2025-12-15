const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const passport = require('passport');

// Google Auth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    (req, res) => {
        // Successful authentication
        const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET);

        // Redirect to frontend with token
        res.redirect(`http://localhost:3000/auth/callback?token=${token}&userId=${req.user._id}&email=${req.user.email}&name=${encodeURIComponent(req.user.full_name)}`);
    }
);

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password, full_name, organization } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'Email already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            password: hashedPassword,
            full_name,
            organization
        });

        const savedUser = await newUser.save();
        res.json({ user: { id: savedUser._id, email: savedUser.email, full_name: savedUser.full_name } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'User not found' });

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).json({ error: 'Invalid password' });

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.header('Authorization', token).json({ token, user: { id: user._id, email: user.email, full_name: user.full_name } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Current User
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update user profile
router.put('/me', auth, async (req, res) => {
    try {
        const { full_name, organization } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.full_name = full_name || user.full_name;
        user.organization = organization || user.organization;

        await user.save();

        res.json({
            id: user._id,
            email: user.email,
            full_name: user.full_name,
            organization: user.organization,
            avatar_url: user.avatar_url
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
