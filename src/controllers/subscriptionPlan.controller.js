const prisma = require('../config/database');
const AppError = require('../utils/AppError');

exports.getAll = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const sortBy = req.query.sortBy || 'createdAt';
        const order = req.query.order === 'desc' ? 'desc' : 'asc';

        const { search, ...filters } = req.query;
        ['page', 'limit', 'sortBy', 'order'].forEach(field => delete filters[field]);

        const where = { ...filters };

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [plans, total] = await Promise.all([
            prisma.subscriptionPlan.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: order },
            }),
            prisma.subscriptionPlan.count({ where }),
        ]);

        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            success: true,
            message: 'Subscription plans retrieved successfully',
            data: plans,
            pagination: {
                totalDetails: total,
                totalPages,
                currentPage: page,
                limit,
            },
        });
    } catch (error) {
        next(error);
    }
};

exports.getOne = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

        const plan = await prisma.subscriptionPlan.findUnique({ where: { id } });

        if (!plan) {
            throw new AppError('Subscription plan not found', 404);
        }

        res.status(200).json({
            success: true,
            message: 'Subscription plan retrieved successfully',
            data: plan,
        });
    } catch (error) {
        next(error);
    }
};

exports.create = async (req, res, next) => {
    try {
        const { name, price, productId } = req.body;

        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) {
            throw new AppError('Associated product not found', 404);
        }

        const plan = await prisma.subscriptionPlan.create({
            data: { name, price, productId },
        });

        res.status(201).json({
            success: true,
            message: 'Subscription plan created successfully',
            data: plan,
        });
    } catch (error) {
        next(error);
    }
};

exports.update = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

        const existing = await prisma.subscriptionPlan.findUnique({ where: { id } });
        if (!existing) {
            throw new AppError('Subscription plan not found', 404);
        }

        const plan = await prisma.subscriptionPlan.update({
            where: { id },
            data: req.body,
        });

        res.status(200).json({
            success: true,
            message: 'Subscription plan updated successfully',
            data: plan,
        });
    } catch (error) {
        next(error);
    }
};

exports.delete = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

        const existing = await prisma.subscriptionPlan.findUnique({ where: { id } });
        if (!existing) {
            throw new AppError('Subscription plan not found to delete', 404);
        }

        await prisma.subscriptionPlan.delete({ where: { id } });

        res.status(200).json({
            success: true,
            message: 'Subscription plan deleted successfully',
            data: null,
        });
    } catch (error) {
        next(error);
    }
};
