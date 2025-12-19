const qualityRepository = require('../repositories/qualityRepository');

class QualityService {
    async getAllUploads(userId) {
        return await qualityRepository.findAllByUserId(userId);
    }

    // File handling is done in middleware (multer), so here we just get the URL
    async createUpload(userId, file, data, protocol, host) {
        const imageUrl = `${protocol}://${host}/uploads/${file.filename}`;

        // Initialize stats
        let qualityScore = 0;
        let freshnessScore = 0;
        let defectScore = 0;
        let aiAnalysis = 'Analysis failed';

        try {
            if (process.env.GEMINI_API_KEY) {
                const { GoogleGenerativeAI } = require("@google/generative-ai");
                const fs = require("fs");
                const genAI = new GoogleGenerativeAI('AIzaSyBwSh18hAUVr1yz_c8XN4ym4ToI38VOPNc');
                const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

                const prompt = "Analyze this food/raw material image. Return a raw JSON object (no markdown formatting, no backticks) with these fields: quality_score (0-100), freshness_score (0-100), defect_score (0-100), analysis_text (short summary).";

                const imagePart = {
                    inlineData: {
                        data: fs.readFileSync(file.path).toString("base64"),
                        mimeType: file.mimetype,
                    },
                };

                const result = await model.generateContent([prompt, imagePart]);
                const response = result.response;
                const text = response.text();

                // Clean the text to ensure it's valid JSON (remove backticks if present)
                const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
                const analysis = JSON.parse(jsonStr);

                qualityScore = analysis.quality_score || 70;
                freshnessScore = analysis.freshness_score || 70;
                defectScore = analysis.defect_score || 10;
                aiAnalysis = analysis.analysis_text || "AI completed analysis.";
            } else {
                // Mock AI analysis logic if no key
                console.log("No GEMINI_API_KEY found, using mock data");
                qualityScore = Math.floor(Math.random() * 20) + 80;
                freshnessScore = Math.floor(Math.random() * 20) + 80;
                defectScore = Math.floor(Math.random() * 10);
                aiAnalysis = 'Simulated analysis (Add GEMINI_API_KEY to enable real AI)';
            }
        } catch (error) {
            console.error("AI Analysis failed:", error);
            aiAnalysis = "AI analysis failed, using fallback values.";
            qualityScore = 50;
        }

        const uploadData = {
            user_id: userId,
            batch_id: data.batch_id,
            image_url: imageUrl,
            quality_score: qualityScore,
            freshness_score: freshnessScore,
            defect_score: defectScore,
            ai_analysis: aiAnalysis,
            notes: data.notes,
        };

        return await qualityRepository.create(uploadData);
    }

    async deleteUpload(id, userId) {
        // In a real app, delete the file from disk here too
        const result = await qualityRepository.delete(id, userId);
        if (!result) {
            // Just return null or throw 404
            // throw new Error('Upload not found');
        }
        return result;
    }
}

module.exports = new QualityService();
