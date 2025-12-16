const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    batch_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    is_read: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now }
});

alertSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id; }
});

module.exports = mongoose.model('Alert', alertSchema);
