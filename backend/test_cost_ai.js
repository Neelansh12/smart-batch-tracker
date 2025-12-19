const costService = require('./services/costService');
const serverConfig = require('./Config/serverConfig');

console.log("API Key loaded:", serverConfig.GEMINI_API_KEY ? "YES" : "NO");

const mockData = {
    product_name: "Test Ketchup",
    packet_size: "1 kg",
    ingredient_cost: 50,
    processing_charge: 10,
    packing_charge: 5,
    misc_charge: 2,
    delivery_cost_per_unit: 3,
    delivery_total_cost: 300,
    delivery_batch_size: 100,
    selling_price: 100,
    total_cost_per_unit: 70,
    profit_loss_amount: 30,
    profit_loss_percentage: 42.8
};

async function testComp() {
    console.log("Testing Cost Service AI...");
    try {
        const result = await costService.analyzeProfitability(mockData);
        console.log("Result:", result);
    } catch (e) {
        console.error("Test execution failed:", e);
    }
}

testComp();
