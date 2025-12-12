const { z } = require('zod');

exports.createSchema = z.object({
    name: z.string({ required_error: 'Name is required' }).min(1, 'Name is required'),
});

exports.updateSchema = z.object({
    name: z.string({ required_error: 'Name is required' }).min(1, 'Name is required'),
});
