const prisma = require('../config/database');
const { hashPassword, comparePassword, generateAccessToken, generateRefreshToken, verifyToken } = require('../utils/auth.utils');
const AppError = require('../utils/error.utils');

exports.register = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new AppError('User already exists', 400);
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: 'USER',
            },
        });

        const { password: _, ...userWithoutPassword } = user;

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: userWithoutPassword,
        });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new AppError('Invalid credentials', 401);
        }

        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            throw new AppError('Invalid credentials', 401);
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            accessToken,
            refreshToken,
        });
    } catch (error) {
        next(error);
    }
};

exports.refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        let decoded;
        try {
            decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
        } catch (err) {
            throw new AppError('Invalid or expired refresh token', 401);
        }

        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!user) {
            throw new AppError('User not found', 401);
        }

        const accessToken = generateAccessToken(user);

        res.status(200).json({
            success: true,
            accessToken,
        });
    } catch (error) {
        next(error);
    }
};

exports.me = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
        });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        const { password, ...userWithoutPassword } = user;

        res.status(200).json({
            success: true,
            user: userWithoutPassword
        });
    } catch (error) {
        next(error);
    }
};
