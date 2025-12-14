const mongoose = require('mongoose');

const qualityUploadSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    batch_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },
    image_url: { type: String, required: true },
    quality_score: Number,
    freshness_score: Number,
    defect_score: Number,
    ai_analysis: String,
    notes: String,
    created_at: { type: Date, default: Date.now }
});

qualityUploadSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id; }
});

module.exports = mongoose.model('QualityUpload', qualityUploadSchema);
