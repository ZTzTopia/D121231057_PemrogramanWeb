const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const fileLogger = require('./middleware/fileLogger.middleware');

const authRouter = require('./routes/auth.routes');
const productRouter = require('./routes/product.routes');
const subscriptionPlanRouter = require('./routes/subscriptionPlan.routes');
const subscriptionRouter = require('./routes/subscription.routes');
const healthRouter = require('./routes/health.routes');
const AppError = require('./utils/error.utils');
const loggerMiddleware = require('./middleware/logger.middleware');
const errorHandler = require('./middleware/error.middleware');

const app = express();

app.use(fileLogger);
app.use(loggerMiddleware);
app.use(helmet());
app.use(compression());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/product', productRouter);
app.use('/api/subscription-plan', subscriptionPlanRouter);
app.use('/api/subscription', subscriptionRouter);
app.use('/api/health', healthRouter);

app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

module.exports = app;
