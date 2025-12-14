const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { registerSchema, loginSchema, refreshTokenSchema } = require('../validators/auth.validator');
const { authLimiter } = require('../middleware/rateLimiter.middleware');

const authRouter = express.Router();

authRouter.post('/register', authLimiter, validate({ body: registerSchema }), authController.register);
authRouter.post('/login', authLimiter, validate({ body: loginSchema }), authController.login);
authRouter.post('/refresh', validate({ body: refreshTokenSchema }), authController.refreshToken);
authRouter.get('/me', authMiddleware, authController.me);

module.exports = authRouter;
