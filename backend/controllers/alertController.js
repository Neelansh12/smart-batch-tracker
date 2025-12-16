const alertService = require('../services/alertService');

class AlertController {
    async getAllAlerts(req, res) {
        try {
            const alerts = await alertService.getAllAlerts(req.user._id);
            res.json(alerts);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async createAlert(req, res) {
        try {
            const alert = await alertService.createAlert(req.user._id, req.body);
            res.json(alert);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async markAsRead(req, res) {
        try {
            const alert = await alertService.markAsRead(req.params.id, req.user._id);
            res.json(alert);
        } catch (err) {
            const status = err.message === 'Alert not found' ? 404 : 500;
            res.status(status).json({ error: err.message });
        }
    }

    async markAllAsRead(req, res) {
        try {
            await alertService.markAllAsRead(req.user._id);
            res.json({ message: 'All alerts marked as read' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async deleteAlert(req, res) {
        try {
            await alertService.deleteAlert(req.params.id, req.user._id);
            res.json({ message: 'Alert deleted' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async clearAllAlerts(req, res) {
        try {
            await alertService.clearAllAlerts(req.user._id);
            res.json({ message: 'All alerts cleared' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = new AlertController();
