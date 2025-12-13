const prisma = require('../config/database');
const AppError = require('../utils/error.utils');
const { parsePagination, formatPagination } = require('../utils/pagination.utils');

exports.getAll = async (req, res, next) => {
    try {
        const { page, limit, skip, sortBy, order, filters, search } = parsePagination(req.query);

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

        const pagination = formatPagination(total, page, limit);

        res.status(200).json({
            success: true,
            message: 'Subscription plans retrieved successfully',
            data: plans,
            pagination,
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
