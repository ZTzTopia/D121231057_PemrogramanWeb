const express = require('express');
const authRouter = require('./routes/auth.routes');
const productRouter = require('./routes/product.routes');
const AppError = require('./utils/AppError');

const app = express();

app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/product', productRouter);

app.use((err, req, res, next) => {
    if (process.env.NODE_ENV === 'development' && err.stack) {
        console.error(err.stack);
    }

    if (err.name === 'ZodError') {
        return res.status(400).json({ 
            success: false,
            errors: err.issues
        });
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = app;
