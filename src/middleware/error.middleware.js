const AppError = require('../utils/AppError');
const { ZodError } = require('zod');
const { Prisma } = require('@prisma/client');

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let errors = undefined;

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    } else if (err instanceof ZodError) {
        statusCode = 400;
        message = 'Validation Error';
        errors = err.issues/* .map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
        })) */;
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            statusCode = 409;
            message = `Unique constraint failed on the fields: ${err.meta.target}`;
        } else if (err.code === 'P2025') {
            statusCode = 404;
            message = 'Record not found';
        } else {
            if (process.env.NODE_ENV === 'development') console.error('Prisma Error:', err);
            message = 'Database Error';
        }
    } else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token. Please log in again.';
    } else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Your token has expired. Please log in again.';
    }

    res.status(statusCode).json({
        success: false,
        message,
        errors,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

module.exports = errorHandler;
