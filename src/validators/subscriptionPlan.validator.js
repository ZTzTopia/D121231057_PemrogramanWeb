const { z } = require('zod');

exports.createSchema = z.object({
    name: z.string({ required_error: 'Name is required' }).min(1, 'Name is required'),
    price: z.number({ required_error: 'Price is required' }).nonnegative('Price must be non-negative'),
    productId: z.number({ required_error: 'Product ID is required' }).int('Product ID must be an integer'),
});

exports.updateSchema = z.object({
    name: z.string().min(1, 'Name is required').optional(),
    price: z.number().nonnegative('Price must be non-negative').optional(),
});
