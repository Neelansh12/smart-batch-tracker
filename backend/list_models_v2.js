const { GoogleGenerativeAI } = require("@google/generative-ai");
const serverConfig = require('./Config/serverConfig');

async function listModels() {
    console.log("Checking available models...");
    if (!serverConfig.GEMINI_API_KEY) {
        console.error("No API KEY found!");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(serverConfig.GEMINI_API_KEY);
        // Note: listModels might not be directly exposed in high-level SDK, 
        // but let's try a simple generation on known models to see which one sticks.

        const modelsToTry = [
            "gemini-1.5-flash",
            "gemini-1.5-pro",
            "gemini-1.0-pro",
            "gemini-pro",
            "gemini-2.0-flash-exp",
            "gemini-2.0-flash"
        ];

        for (const modelName of modelsToTry) {
            console.log(`Trying ${modelName}...`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Test");
                console.log(`SUCCESS: ${modelName} is working.`);
                return; // Stop after first success
            } catch (err) {
                console.log(`FAIL: ${modelName} - ${err.message.split('\n')[0]}`);
            }
        }
    } catch (e) {
        console.error("Fatal Error:", e);
    }
}

listModels();
