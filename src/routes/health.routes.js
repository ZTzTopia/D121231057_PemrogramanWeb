const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        // pid: process.pid,
        // env: process.env.NODE_ENV || 'development',
    });
});

module.exports = router;
