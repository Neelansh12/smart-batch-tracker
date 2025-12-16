const QualityUpload = require('../models/QualityUpload');

class QualityRepository {
    async findAllByUserId(userId) {
        return await QualityUpload.find({ user_id: userId });
    }

    async create(uploadData) {
        const upload = new QualityUpload(uploadData);
        return await upload.save();
    }

    async delete(id, userId) {
        return await QualityUpload.findOneAndDelete({ _id: id, user_id: userId });
    }
}

module.exports = new QualityRepository();
