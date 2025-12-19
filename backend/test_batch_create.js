const mongoose = require('mongoose');
const batchService = require('./services/batchService');
const serverConfig = require('./Config/serverConfig');

// Connect to DB
mongoose.connect(serverConfig.MONGODB_URI)
    .then(() => console.log("Connected to DB"))
    .catch(err => console.error("DB Connection Error:", err));

const mockUser = new mongoose.Types.ObjectId(); // Mock User ID

const payload_individual = {
    batch_id: "TEST-IND-001",
    type: "individual",
    ingredients: [{ name: "Test Item", weight: 100, cost: 50 }],
    final_product: "Test Output",
    product: "Test Output",
    input_weight: 100,
    status: "Inbound",
    stage: "inbound"
};

const payload_missing_weight = {
    batch_id: "TEST-FAIL-001",
    type: "individual",
    ingredients: [{ name: "Item", weight: 0, cost: 10 }],
    final_product: "Output",
    product: "Output",
    input_weight: 0, // Testing 0 weight
    status: "Inbound",
    stage: "inbound"
};

async function testCreate() {
    try {
        console.log("Testing Normal Creation...");
        const res1 = await batchService.createBatch(mockUser, payload_individual);
        console.log("Success 1:", res1.batch_id);

        console.log("Testing Zero Weight Creation...");
        const res2 = await batchService.createBatch(mockUser, payload_missing_weight);
        console.log("Success 2:", res2.batch_id);
    } catch (error) {
        console.error("Creation Failed:", error);
        if (error.errors) {
            console.error("Validation Errors:", JSON.stringify(error.errors, null, 2));
        }
    } finally {
        mongoose.disconnect();
    }
}

setTimeout(testCreate, 2000); // Wait for DB connection
