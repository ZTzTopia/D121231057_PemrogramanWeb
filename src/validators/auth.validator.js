const { z } = require('zod');

exports.registerSchema = z.object({
    email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
    password: z.string({ required_error: 'Password is required' }).min(8, 'Password must be at least 8 characters long'),
    name: z.string({ required_error: 'Name is required' }).min(1, 'Name is required'),
});

exports.loginSchema = z.object({
    email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
    password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required'),
});

exports.refreshTokenSchema = z.object({
    refreshToken: z.string({ required_error: 'Refresh token is required' }).min(1, 'Refresh token is required'),
});
