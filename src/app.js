const express = require('express');
const authRouter = require('./routes/auth.routes');

const app = express();

app.use(express.json());

app.use('/api/auth', authRouter);

app.use((err, req, res, next) => {
    // console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;
