const CostCalculation = require('../models/CostCalculation');
const costService = require('../services/costService');

class CostController {
    // Save a new calculation
    async createCalculation(req, res) {
        try {
            const data = req.body;

            // Basic Backend Calculation Verification (optional, but good for data integrity)
            const deliveryPerUnit = data.delivery_batch_size > 0
                ? (data.delivery_total_cost / data.delivery_batch_size)
                : 0;

            const totalCost =
                (Number(data.ingredient_cost) || 0) +
                (Number(data.processing_charge) || 0) +
                (Number(data.packing_charge) || 0) +
                (Number(data.misc_charge) || 0) +
                deliveryPerUnit;

            const sellingPrice = Number(data.selling_price) || 0;
            const profitAmount = sellingPrice - totalCost;
            const profitPercent = totalCost > 0 ? ((profitAmount / totalCost) * 100) : 0;

            const calculation = new CostCalculation({
                user_id: req.user._id,
                ...data,
                delivery_cost_per_unit: deliveryPerUnit,
                total_cost_per_unit: totalCost,
                profit_loss_amount: profitAmount,
                profit_loss_percentage: profitPercent
            });

            await calculation.save();
            res.status(201).json(calculation);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Get all calculations for user
    async getCalculations(req, res) {
        try {
            const calculations = await CostCalculation.find({ user_id: req.user._id })
                .sort({ created_at: -1 })
                .limit(20); // Limit to recent 20
            res.json(calculations);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // specific route to trigger AI analysis
    async analyzeCost(req, res) {
        try {
            const { id } = req.params;
            const calculation = await CostCalculation.findOne({ _id: id, user_id: req.user._id });

            if (!calculation) {
                return res.status(404).json({ error: "Calculation not found" });
            }

            // If already analyzed, return cached
            if (calculation.ai_analysis) {
                return res.json({ analysis: calculation.ai_analysis });
            }

            // Call AI Service
            const analysis = await costService.analyzeProfitability(calculation);

            // Save result
            calculation.ai_analysis = analysis;
            await calculation.save();

            res.json({ analysis });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new CostController();
