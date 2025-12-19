require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Just to initialize, though not used for listing
        // Accessing the API directly to list models simpler via the library if exposed, 
        // but simpler: 
        // The library doesn't strictly expose listModels on the instance easily in all versions?
        // Let's use the intended way if possible.
        // Actually, let's just try to change the model name in the service first to something known to be stable.

        // However, the error suggests it's a 404 on the model resource.
        console.log("Testing model availability...");
    } catch (error) {
        console.error("Error:", error);
    }
}

// Better yet, I'll just try to use 'gemini-1.5-flash-001' or 'gemini-1.5-pro' directly in the service.
// The error is explicit about 'models/gemini-1.5-flash' not found.
