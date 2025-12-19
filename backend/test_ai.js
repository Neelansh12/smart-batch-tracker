const environmentalService = require('./services/environmentalService');
const serverConfig = require('./Config/serverConfig');
const { GoogleGenerativeAI } = require("@google/generative-ai");


console.log("Checking API Key:", serverConfig.GEMINI_API_KEY ? "Present (" + serverConfig.GEMINI_API_KEY.substring(0, 4) + "...)" : "Missing");

const mockData = {
    location: "Test Location",
    weather: { temp: 25, condition: "Sunny" },
    soil: { moisture: 30, ph: 6.5 },
    aqi: { index: 50, status: "Good" }
};

console.log("Running analysis...");



const models = ["gemini-pro"];



async function testModels() {
    for (const modelName of models) {
        console.log(`Testing model: ${modelName}`);
        try {
            const genAI = new GoogleGenerativeAI(serverConfig.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: modelName });

            const prompt = `
            Analyze these environmental conditions for food storage/processing optimization:
            Location: ${mockData.location}
            Weather: ${JSON.stringify(mockData.weather)}
            
            Keep it under 10 words.
            `;

            const result = await model.generateContent(prompt);
            console.log(`SUCCESS with ${modelName}:`, result.response.text());
            return; // Exit on first success
        } catch (error) {
            console.error(`FAILED with ${modelName}:`, error.message);
        }
    }
}

testModels();

