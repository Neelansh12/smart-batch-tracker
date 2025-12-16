const batchRepository = require('../repositories/batchRepository');

class BatchService {
    async getAllBatches(userId) {
        return await batchRepository.findAllByUserId(userId);
    }

    async createBatch(userId, data) {
        return await batchRepository.create({ ...data, user_id: userId });
    }

    async updateBatch(id, userId, data) {
        const updatedBatch = await batchRepository.update(id, userId, data);
        if (!updatedBatch) {
            throw new Error('Batch not found');
        }
        return updatedBatch;
    }

    async deleteBatch(id, userId) {
        const deletedBatch = await batchRepository.delete(id, userId);
        if (!deletedBatch) {
            throw new Error('Batch not found');
        }
        return deletedBatch;
    }
}

module.exports = new BatchService();
