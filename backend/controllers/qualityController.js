const qualityService = require('../services/qualityService');

class QualityController {
    async getAllUploads(req, res) {
        try {
            const uploads = await qualityService.getAllUploads(req.user._id);
            res.json(uploads);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async createUpload(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No image file uploaded' });
            }

            const upload = await qualityService.createUpload(
                req.user._id,
                req.file,
                req.body,
                req.protocol,
                req.get('host')
            );
            res.json(upload);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async deleteUpload(req, res) {
        try {
            await qualityService.deleteUpload(req.params.id, req.user._id);
            res.json({ message: 'Upload deleted' });
        } catch (err) {
            const status = err.message === 'Upload not found' ? 404 : 500;
            res.status(status).json({ error: err.message });
        }
    }
}

module.exports = new QualityController();
