const { z } = require('zod');

// Note: Quality upload is multipart/form-data.
// Zod works best with strictly structured JSON.
// For multipart, req.body fields might be strings that need coercion.
// But we'll define the expected structure.
// If using existing validate middleware on req.body, it should work for text fields.
const createQualityUploadSchema = z.object({
    body: z.object({
        batch_id: z.string().optional(),
        notes: z.string().optional(),
    }),
});

module.exports = {
    createQualityUploadSchema,
};
