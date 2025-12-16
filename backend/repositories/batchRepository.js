const Batch = require('../models/Batch');

class BatchRepository {
    async findAllByUserId(userId) {
        return await Batch.find({ user_id: userId });
    }

    async create(batchData) {
        const batch = new Batch(batchData);
        return await batch.save();
    }

    async update(id, userId, updateData) {
        return await Batch.findOneAndUpdate(
            { _id: id, user_id: userId },
            updateData,
            { new: true }
        );
    }

    async delete(id, userId) {
        return await Batch.findOneAndDelete({ _id: id, user_id: userId });
    }
}

module.exports = new BatchRepository();
