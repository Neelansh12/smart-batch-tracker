const environmentalService = require('../services/environmentalService');

class EnvironmentalController {
    async analyze(req, res) {
        try {
            const analysis = await environmentalService.analyzeConditions(req.body);
            res.json({ analysis });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = new EnvironmentalController();
