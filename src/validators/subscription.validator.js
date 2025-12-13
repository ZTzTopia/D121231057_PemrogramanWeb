const { z } = require('zod');

exports.createSchema = z.object({
    planId: z.number({ required_error: 'Plan ID is required' }).int('Plan ID must be an integer'),
    userId: z.number().int().optional(),
});

exports.updateSchema = z.object({
    planId: z.number().int().optional(),
});
