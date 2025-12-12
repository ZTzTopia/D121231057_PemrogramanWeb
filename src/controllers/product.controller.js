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

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: order },
            }),
            prisma.product.count({ where }),
        ]);

        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            success: true,
            message: 'Products retrieved successfully',
            data: products,
            pagination: {
                totalDetails: total,
                totalPages,
                currentPage: page,
                limit
            }
        });

    } catch (error) {
        next(error);
    }
};

exports.getOne = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

        const product = await prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            throw new AppError('Product not found', 404);
        }

        res.status(200).json({
            success: true,
            message: 'Product retrieved successfully',
            data: product,
        });

    } catch (error) {
        next(error);
    }
};

exports.create = async (req, res, next) => {
    try {
        const product = await prisma.product.create({
            data: { name: req.body.name },
        });

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product,
        });
    } catch (error) {
        next(error);
    }
};

exports.update = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

        const existingProduct = await prisma.product.findUnique({ where: { id } });
        if (!existingProduct) {
            throw new AppError('Product not found', 404);
        }

        const product = await prisma.product.update({
            where: { id },
            data: req.body,
        });

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: product,
        });
    } catch (error) {
        next(error);
    }
};

exports.delete = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

        const existingProduct = await prisma.product.findUnique({ where: { id } });
        if (!existingProduct) {
            throw new AppError('Product not found to delete', 404);
        }

        await prisma.product.delete({
            where: { id },
        });

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
            data: null,
        });
    } catch (error) {
        next(error);
    }
};
