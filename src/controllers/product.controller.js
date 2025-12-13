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

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: order },
            }),
            prisma.product.count({ where }),
        ]);

        const pagination = formatPagination(total, page, limit);

        res.status(200).json({
            success: true,
            message: 'Products retrieved successfully',
            data: products,
            pagination,
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
