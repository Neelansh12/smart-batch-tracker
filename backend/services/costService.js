const { GoogleGenerativeAI } = require('@google/generative-ai');
const serverConfig = require('../Config/serverConfig');

const genAI = new GoogleGenerativeAI(serverConfig.GEMINI_API_KEY);

// Use gemini-2.0-flash as requested, falling back if not available (though test showed it likely is)
const MODEL_NAME = 'gemini-2.5-flash';

class CostService {
    async analyzeProfitability(data) {
        try {
            const model = genAI.getGenerativeModel({ model: MODEL_NAME });

            const prompt = `
            Analyze the cost structure for a product and suggest ways to minimize loss and maximize profit.
            
            Product: ${data.product_name}
            Packet Size: ${data.packet_size}
            
            Cost Breakdown (Per Packet):
            - Ingredients: ${data.ingredient_cost}
            - Processing: ${data.processing_charge}
            - Packing: ${data.packing_charge}
            - Misc: ${data.misc_charge}
            - Delivery (Per Unit): ${data.delivery_cost_per_unit} (Total Delivery: ${data.delivery_total_cost} for ${data.delivery_batch_size} units)
            
            Selling Price: ${data.selling_price}
            
            Results:
            - Total Cost: ${data.total_cost_per_unit}
            - Profit/Loss: ${data.profit_loss_amount} (${data.profit_loss_percentage}%)

            Provide a concise, actionable summary (max 150 words) on:
            1. Which cost component is highest relative to the selling price?
            2. Specific strategies to reduce that cost.
            3. Pricing recommendation if the margin is too low.
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("AI Analysis Error:", error);
            return "AI Analysis unavailable at the moment.";
        }
    }
}

module.exports = new CostService();
