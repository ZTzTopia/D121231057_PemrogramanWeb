const prisma = require('../config/database');
const { hashPassword, comparePassword, generateAccessToken, generateRefreshToken, verifyToken } = require('../utils/auth.utils');
const { registerSchema, loginSchema } = require('../validators/auth.validator');
const AppError = require('../utils/AppError');

exports.register = async (req, res, next) => {
    try {
        const validatedData = registerSchema.parse(req.body);

        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await hashPassword(validatedData.password);

        const user = await prisma.user.create({
            data: {
                email: validatedData.email,
                password: hashedPassword,
                name: validatedData.name,
                role: 'USER',
            },
        });

        const { password, ...userWithoutPassword } = user;

        res.status(201).json({
            message: 'User registered successfully',
            user: userWithoutPassword,
        });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const validatedData = loginSchema.parse(req.body);

        const user = await prisma.user.findUnique({
            where: { email: validatedData.email },
        });

        if (!user) {
            throw new AppError('Invalid credentials', 401);
        }

        const isPasswordValid = await comparePassword(validatedData.password, user.password);

        if (!isPasswordValid) {
            throw new AppError('Invalid credentials', 401);
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.status(200).json({
            message: 'Login successful',
            accessToken,
            refreshToken,
        });
    } catch (error) {
        next(error);
    }
};

exports.refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            throw new AppError('Refresh token is required', 400);
        }

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

        res.status(200).json({ user: userWithoutPassword });
    } catch (error) {
        next(error);
    }
};
