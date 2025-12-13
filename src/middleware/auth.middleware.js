const { verifyToken } = require('../utils/auth.utils');
const AppError = require('../utils/error.utils');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AppError('Authentication required. Please provide a Bearer token.', 401));
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyToken(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = authMiddleware;
