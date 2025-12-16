const { z } = require('zod');

const createAlertSchema = z.object({
    body: z.object({
        title: z.string().min(1),
        message: z.string().min(1),
        severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
        batch_id: z.string().optional(),
    }),
});

module.exports = {
    createAlertSchema,
};
