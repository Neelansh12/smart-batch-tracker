const alertRepository = require('../repositories/alertRepository');

class AlertService {
    async getAllAlerts(userId) {
        return await alertRepository.findAllByUserId(userId);
    }

    async createAlert(userId, data) {
        return await alertRepository.create({ ...data, user_id: userId });
    }

    async markAsRead(id, userId) {
        const alert = await alertRepository.markAsRead(id, userId);
        if (!alert) {
            throw new Error('Alert not found');
        }
        return alert;
    }

    async markAllAsRead(userId) {
        return await alertRepository.markAllAsRead(userId);
    }

    async deleteAlert(id, userId) {
        const result = await alertRepository.delete(id, userId);
        // Note: mongoose findOneAndDelete returns the deleted doc if found, null if not
        // The original code was waiting but not checking return value strictly for 404, but just proceeding.
        // I will check for 404 to be safe.
        // However, the original code: await Alert.findOneAndDelete(...) -> res.json({ message: 'Alert deleted' });
        // It didn't throw if not found.
        // I will mimic that or improve it. Let's improve it.
        // Actually, original code for delete didn't check return value.
        // I'll stick to original behavior but adding a check is better.
        // "findOneAndDelete" returns the doc.
        if (!result) {
            // Optionally throw error, but for idempotency maybe just return
        }
        return result;
    }

    async clearAllAlerts(userId) {
        return await alertRepository.deleteMany(userId);
    }
}

module.exports = new AlertService();
