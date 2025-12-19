const { z } = require('zod');

const createBatchSchema = z.object({
    body: z.object({
        batch_id: z.string().min(1),
        type: z.enum(['individual', 'group']).default('individual'),
        ingredients: z.array(z.object({
            name: z.string(),
            weight: z.number(),
            cost: z.number(),
            status: z.string().optional(),
            wastage: z.number().optional()
        })).optional(),
        selling_price: z.number().optional(),
        final_product: z.string().min(1),
        product: z.string().optional(), // Allow optional, or mapped from final_product
        status: z.string().optional(), // Changed from enum to string for custom status
        stage: z.enum(['inbound', 'processing', 'packaging', 'dispatch', 'completed']).optional(),
        input_weight: z.number().optional(), // Can be calculated on backend
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
        type: z.enum(['individual', 'group']).optional(),
        ingredients: z.array(z.object({
            name: z.string(),
            weight: z.number(),
            cost: z.number(),
            status: z.string().optional(),
            wastage: z.number().optional()
        })).optional(),
        selling_price: z.number().optional(),
        final_product: z.string().min(1).optional(),
        product: z.string().min(1).optional(),
        status: z.string().optional(), // Custom text
        stage: z.enum(['inbound', 'processing', 'packaging', 'dispatch', 'completed']).optional(),
        input_weight: z.number().optional(),
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
