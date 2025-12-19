const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GEMINI_API_KEY } = require('../Config/serverConfig');

class EnvironmentalService {
    async analyzeConditions(data) {
        try {
            if (!GEMINI_API_KEY) {
                return "AI Analysis Unavailable: GEMINI_API_KEY not found.";
            }

            const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            const prompt = `
            Analyze these environmental conditions for food storage/processing optimization:
            Location: ${data.location}
            Weather: ${JSON.stringify(data.weather)}
            Soil: ${JSON.stringify(data.soil)}
            AQI: ${JSON.stringify(data.aqi)}

            Provide a concise summary with:
            1. Precautions for sensitive food batches.
            2. Tips to maximize worker efficiency and storage handling in these conditions.
            Keep it under 150 words.
            `;

            const result = await model.generateContent(prompt);
            return result.response.text();

        } catch (error) {
            console.error("AI Environment Analysis failed:", error);
            return "AI Analysis failed to generate insights.";
        }
    }
}

module.exports = new EnvironmentalService();
