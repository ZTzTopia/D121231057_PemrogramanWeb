const { z } = require('zod');

exports.registerSchema = z.object({
    email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
    password: z.string({ required_error: 'Password is required' })
        .min(8, `Password must be at least 8 characters long`)
        .refine((val) => /[a-z]/.test(val), { message: 'Password must contain at least one lowercase letter' })
        .refine((val) => /[A-Z]/.test(val), { message: 'Password must contain at least one uppercase letter' })
        .refine((val) => /\d/.test(val), { message: 'Password must contain at least one digit' })
        .refine((val) => /[^A-Za-z0-9]/.test(val), { message: 'Password must contain at least one special character' }),
    name: z.string({ required_error: 'Name is required' }).min(1, 'Name is required'),
});

exports.loginSchema = z.object({
    email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
    password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required'),
});

exports.refreshTokenSchema = z.object({
    refreshToken: z.string({ required_error: 'Refresh token is required' }).min(1, 'Refresh token is required'),
});
