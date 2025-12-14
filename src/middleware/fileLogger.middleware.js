const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

const logDir = path.join(__dirname, '..', '..', 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

const accessLogStream = fs.createWriteStream(path.join(logDir, 'access.log'), { flags: 'a' });

const fileLogger = morgan('combined', { stream: accessLogStream });

module.exports = fileLogger;
