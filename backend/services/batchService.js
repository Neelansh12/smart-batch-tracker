const batchRepository = require('../repositories/batchRepository');
<<<<<<< HEAD
=======
const alertService = require('./alertService');
>>>>>>> f33b072b3e1bf2de2cf4bc8c5fcbe665b137b73d

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
<<<<<<< HEAD
=======

        // --- ALERT LOGIC: High Loss Detection ---
        try {
            if (updatedBatch.loss_percentage && updatedBatch.loss_percentage > 15) {
                await alertService.createAlert(userId, {
                    title: "High Yield Loss Alert",
                    message: `Batch ${updatedBatch.batch_id} has exceeded the loss threshold with ${updatedBatch.loss_percentage.toFixed(2)}% loss.`,
                    severity: "critical", // User specified >15% is bad, so making it critical
                    batch_id: updatedBatch._id
                });
            }
        } catch (error) {
            console.error("Failed to generate batch alert:", error);
        }

>>>>>>> f33b072b3e1bf2de2cf4bc8c5fcbe665b137b73d
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
