const express = require('express');
const productController = require('../controllers/product.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { createSchema, updateSchema } = require('../validators/product.validator');

const productRouter = express.Router();

productRouter.get('/', authMiddleware, productController.getAll);
productRouter.get('/:id', authMiddleware, productController.getOne);
productRouter.post('/', authMiddleware, validate({ body: createSchema }), productController.create);
productRouter.put('/:id', authMiddleware, validate({ body: updateSchema }), productController.update);
productRouter.delete('/:id', authMiddleware, productController.delete);

module.exports = productRouter;
