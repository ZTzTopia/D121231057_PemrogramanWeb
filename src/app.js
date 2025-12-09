const express = require('express');
const authRouter = require('./routes/auth.routes');

const app = express();

app.use(express.json());

app.use('/api/auth', authRouter);

app.use((err, req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        console.error(err.stack);
    }

    if (err.name === 'ZodError') {
        return res.status(400).json({ errors: err.errors });
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message,
        });
    }

    res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = app;
