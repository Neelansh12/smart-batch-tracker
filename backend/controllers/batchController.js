const batchService = require('../services/batchService');

class BatchController {
    async getAllBatches(req, res) {
        try {
            const batches = await batchService.getAllBatches(req.user._id);
            res.json(batches);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async createBatch(req, res) {
        try {
            const batch = await batchService.createBatch(req.user._id, req.body);
            res.json(batch);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async updateBatch(req, res) {
        try {
            const batch = await batchService.updateBatch(req.params.id, req.user._id, req.body);
            res.json(batch);
        } catch (err) {
            const status = err.message === 'Batch not found' ? 404 : 500;
            res.status(status).json({ error: err.message });
        }
    }

    async deleteBatch(req, res) {
        try {
            await batchService.deleteBatch(req.params.id, req.user._id);
            res.json({ message: 'Batch deleted' });
        } catch (err) {
            const status = err.message === 'Batch not found' ? 404 : 500;
            res.status(status).json({ error: err.message });
        }
    }
}

module.exports = new BatchController();
