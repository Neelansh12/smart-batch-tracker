const Alert = require('../models/Alert');

class AlertRepository {
    async findAllByUserId(userId) {
        return await Alert.find({ user_id: userId });
    }

    async create(alertData) {
        const alert = new Alert(alertData);
        return await alert.save();
    }

    async markAsRead(id, userId) {
        return await Alert.findOneAndUpdate(
            { _id: id, user_id: userId },
            { is_read: true },
            { new: true }
        );
    }

    async markAllAsRead(userId) {
        return await Alert.updateMany({ user_id: userId }, { is_read: true });
    }

    async delete(id, userId) {
        return await Alert.findOneAndDelete({ _id: id, user_id: userId });
    }

    async deleteMany(userId) {
        return await Alert.deleteMany({ user_id: userId });
    }
}

module.exports = new AlertRepository();
