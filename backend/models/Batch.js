const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    batch_id: { type: String, required: true },
    product: { type: String, required: true },
    status: {
        type: String,
        enum: ['inbound', 'processing', 'packaging', 'dispatch', 'completed'],
        default: 'inbound'
    },
    input_weight: { type: Number, required: true },
    output_weight: Number,
    loss_percentage: Number,
    moisture_loss: { type: Number, default: 0 },
    trimming_loss: { type: Number, default: 0 },
    processing_loss: { type: Number, default: 0 },
    spoilage_loss: { type: Number, default: 0 },

    // New Fields
    supplier_info: {
        name: String,
        origin: String,
        batch_code: String // Supplier's batch code
    },
    dates: {
        manufacturing: Date,
        expiry: Date,
        received: { type: Date, default: Date.now }
    },
    timeline: [{
        status: {
            type: String,
            enum: ['inbound', 'processing', 'packaging', 'dispatch', 'completed']
        },
        timestamp: { type: Date, default: Date.now },
        notes: String,
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }],

    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

batchSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id; }
});

module.exports = mongoose.model('Batch', batchSchema);
