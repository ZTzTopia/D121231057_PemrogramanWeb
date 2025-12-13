const prisma = require('../config/database');
const AppError = require('../utils/AppError');

exports.getAll = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const sortBy = req.query.sortBy || 'createdAt';
        const order = req.query.order === 'desc' ? 'desc' : 'asc';

        const where = {};

        if (req.user && req.user.role !== 'ADMIN') {
            where.userId = req.user.userId;
        }

        const [subscriptions, total] = await Promise.all([
            prisma.subscription.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: order },
                include: { plan: { include: { product: true } } },
            }),
            prisma.subscription.count({ where }),
        ]);

        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            success: true,
            message: 'Subscriptions retrieved successfully',
            data: subscriptions,
            pagination: { totalDetails: total, totalPages, currentPage: page, limit },
        });
    } catch (error) {
        next(error);
    }
};

exports.getOne = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

        const subscription = await prisma.subscription.findUnique({
            where: { id },
            include: { plan: { include: { product: true } } },
        });

        if (!subscription) {
            throw new AppError('Subscription not found', 404);
        }

        if (req.user.role !== 'ADMIN' && subscription.userId !== req.user.userId) {
            throw new AppError('Forbidden', 403);
        }

        res.status(200).json({ success: true, message: 'Subscription retrieved successfully', data: subscription });
    } catch (error) {
        next(error);
    }
};

exports.create = async (req, res, next) => {
    try {
        const { planId, userId } = req.body;

        if (userId && req.user.role !== 'ADMIN') {
            throw new AppError('Only admin can create subscription for other users', 403);
        }

        const targetUserId = userId || req.user.userId;

        const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
        if (!plan) {
            throw new AppError('Subscription plan not found', 404);
        }

        const subscription = await prisma.subscription.create({
            data: { userId: targetUserId, planId },
            include: { plan: { include: { product: true } } },
        });

        res.status(201).json({ success: true, message: 'Subscription created successfully', data: subscription });
    } catch (error) {
        next(error);
    }
};

exports.update = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const updates = req.body;

        const existing = await prisma.subscription.findUnique({ where: { id } });
        if (!existing) {
            throw new AppError('Subscription not found', 404);
        }

        if (req.user.role !== 'ADMIN' && existing.userId !== req.user.userId) {
            throw new AppError('Forbidden', 403);
        }

        if (updates.planId) {
            const plan = await prisma.subscriptionPlan.findUnique({ where: { id: updates.planId } });
            if (!plan) {
                throw new AppError('Subscription plan not found', 404);
            }
        }

        const updated = await prisma.subscription.update({ where: { id }, data: updates, include: { plan: { include: { product: true } } } });

        res.status(200).json({ success: true, message: 'Subscription updated successfully', data: updated });
    } catch (error) {
        next(error);
    }
};

exports.delete = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

        const existing = await prisma.subscription.findUnique({ where: { id } });
        if (!existing) {
            throw new AppError('Subscription not found to delete', 404);
        }

        if (req.user.role !== 'ADMIN' && existing.userId !== req.user.userId) {
            throw new AppError('Forbidden', 403);
        }

        await prisma.subscription.delete({ where: { id } });

        res.status(200).json({ success: true, message: 'Subscription deleted successfully', data: null });
    } catch (error) {
        next(error);
    }
};
