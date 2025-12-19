const mongoose = require('mongoose');

const costCalculationSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product_name: { type: String, required: true },
    packet_size: { type: String, required: true }, // e.g. "1 kg", "500g"

    // Detailed Costs (Per Unit unless specified)
    ingredient_cost: { type: Number, required: true }, // Per packet
    processing_charge: { type: Number, required: true }, // Per packet
    packing_charge: { type: Number, required: true },
    misc_charge: { type: Number, default: 0 },

    // Delivery Logic
    delivery_total_cost: { type: Number, default: 0 },
    delivery_batch_size: { type: Number, default: 1 }, // How many packets in one delivery run
    delivery_cost_per_unit: { type: Number, default: 0 }, // Calculated

    // Selling
    selling_price: { type: Number, required: true },

    // Results
    total_cost_per_unit: { type: Number, required: true },
    profit_loss_amount: { type: Number, required: true },
    profit_loss_percentage: { type: Number, required: true },

    // AI Analysis
    ai_analysis: { type: String }, // Stored advice

    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CostCalculation', costCalculationSchema);
