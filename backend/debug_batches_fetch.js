const batchService = require('./services/batchService');
const mongoose = require('mongoose');
const serverConfig = require('./Config/serverConfig');

async function testFetch() {
    try {
        await mongoose.connect(serverConfig.MONGODB_URI);
        console.log("Connected to DB");

        // We need a dummy user ID. 
        // I'll grab the first batch found to get a user ID, or just list all batches if the service allows without user ID (it usually requires it).
        // batchService.getAllBatches(userId)

        // Let's cheat and use models directly to find a user id
        const Batch = require('./models/Batch');
        const oneBatch = await Batch.findOne();
        if (!oneBatch) {
            console.log("No batches in DB.");
            return;
        }

        console.log("Found User ID:", oneBatch.user_id);
        const batches = await batchService.getAllBatches(oneBatch.user_id);
        console.log("Batches Retrieved:", batches.length);
        console.log(JSON.stringify(batches, null, 2));

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

testFetch();
