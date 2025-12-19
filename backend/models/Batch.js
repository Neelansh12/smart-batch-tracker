const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    batch_id: { type: String, required: true },
    type: {
        type: String,
        enum: ['individual', 'group'],
        default: 'individual'
    },
    ingredients: [{
        name: { type: String, required: true },
        weight: { type: Number, required: true },
        cost: { type: Number, required: true },
        status: { type: String, default: 'Pending' }, // Per-ingredient status
        wastage: { type: Number, default: 0 } // Accumulated wastage
    }],
    selling_price: { type: Number }, // To calculate profit/loss
    final_product: { type: String, required: true }, // Renamed from product or acting as "Final Product Expected"
    product: { type: String }, // Keep for backward compatibility or display if needed, or mapped to final_product
    status: {
        type: String, // Custom free-text status
        default: 'Inbound'
    },
    stage: { // System stage for Pipeline/Kanban
        type: String,
        enum: ['inbound', 'processing', 'packaging', 'dispatch', 'completed'],
        default: 'inbound'
    },
    input_weight: { type: Number, required: true }, // Total weight calculated from ingredients
    output_weight: Number,
    loss_percentage: Number,
    moisture_loss: { type: Number, default: 0 },
    trimming_loss: { type: Number, default: 0 },
    processing_loss: { type: Number, default: 0 },
    spoilage_loss: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

batchSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id; }
});

module.exports = mongoose.model('Batch', batchSchema);
