const authService = require('../services/authService');

class AuthController {
    async register(req, res) {
        try {
            const user = await authService.register(req.body);
            res.json({ user });
        } catch (err) {
            const status = err.message === 'Email already exists' ? 400 : 500;
            res.status(status).json({ error: err.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await authService.login(email, password);
            res.header('Authorization', result.token).json(result);
        } catch (err) {
            const status = (err.message === 'User not found' || err.message === 'Invalid password') ? 400 : 500;
            res.status(status).json({ error: err.message });
        }
    }

    async getCurrentUser(req, res) {
        try {
            const user = await authService.getCurrentUser(req.user._id);
            res.json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async updateProfile(req, res) {
        try {
            const result = await authService.updateProfile(req.user._id, req.body);
            res.json(result);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

}

module.exports = new AuthController();
