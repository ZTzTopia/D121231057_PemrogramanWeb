const express = require('express');
const productController = require('../controllers/product.controller');
const authMiddleware = require('../middleware/auth.middleware');

const productRouter = express.Router();


productRouter.get('/', authMiddleware, productController.getAll);
productRouter.get('/:id', authMiddleware, productController.getOne);
productRouter.post('/', authMiddleware, productController.create);
productRouter.put('/:id', authMiddleware, productController.update);
productRouter.delete('/:id', authMiddleware, productController.delete);

module.exports = productRouter;
