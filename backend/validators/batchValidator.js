const { z } = require('zod');

const createBatchSchema = z.object({
    body: z.object({
        batch_id: z.string().min(1),
        product: z.string().min(1),
        status: z.enum(['inbound', 'processing', 'packaging', 'dispatch', 'completed']).optional(),
        input_weight: z.number().positive(),
        output_weight: z.number().optional(),
        loss_percentage: z.number().optional(),
        moisture_loss: z.number().optional(),
        trimming_loss: z.number().optional(),
        processing_loss: z.number().optional(),
        spoilage_loss: z.number().optional(),
    }),
});

const updateBatchSchema = z.object({
    body: z.object({
        batch_id: z.string().min(1).optional(),
        product: z.string().min(1).optional(),
        status: z.enum(['inbound', 'processing', 'packaging', 'dispatch', 'completed']).optional(),
        input_weight: z.number().positive().optional(),
        output_weight: z.number().optional(),
        loss_percentage: z.number().optional(),
        moisture_loss: z.number().optional(),
        trimming_loss: z.number().optional(),
        processing_loss: z.number().optional(),
        spoilage_loss: z.number().optional(),
    }),
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId'),
    }),
});

module.exports = {
    createBatchSchema,
    updateBatchSchema,
};
