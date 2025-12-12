const { z } = require('zod');

exports.createSchema = z.object({
    name: z.string().min(1, 'Name is required'),
});

exports.updateSchema = z.object({
    name: z.string().min(1, 'Name is required'),
});
