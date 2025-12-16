const qualityRepository = require('../repositories/qualityRepository');

class QualityService {
    async getAllUploads(userId) {
        return await qualityRepository.findAllByUserId(userId);
    }

    // File handling is done in middleware (multer), so here we just get the URL
    async createUpload(userId, file, data, protocol, host) {
        const imageUrl = `${protocol}://${host}/uploads/${file.filename}`;

        // Mock AI analysis logic
        const qualityScore = Math.floor(Math.random() * 20) + 80;
        const freshnessScore = Math.floor(Math.random() * 20) + 80;
        const defectScore = Math.floor(Math.random() * 10);

        // Simulate AI analysis delay if we wanted, but synchronous for now
        const uploadData = {
            user_id: userId,
            batch_id: data.batch_id,
            image_url: imageUrl,
            quality_score: qualityScore,
            freshness_score: freshnessScore,
            defect_score: defectScore,
            ai_analysis: 'Automated analysis pending integration',
            notes: data.notes,
        };

        return await qualityRepository.create(uploadData);
    }

    async deleteUpload(id, userId) {
        // In a real app, delete the file from disk here too
        const result = await qualityRepository.delete(id, userId);
        if (!result) {
            // Just return null or throw 404
            // throw new Error('Upload not found');
        }
        return result;
    }
}

module.exports = new QualityService();
