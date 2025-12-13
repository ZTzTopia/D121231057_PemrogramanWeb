const express = require('express');
const subscriptionController = require('../controllers/subscription.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { createSchema, updateSchema } = require('../validators/subscription.validator');

const router = express.Router();

router.get('/', authMiddleware, subscriptionController.getAll);
router.get('/:id', authMiddleware, subscriptionController.getOne);
router.post('/', authMiddleware, validate({ body: createSchema }), subscriptionController.create);
router.put('/:id', authMiddleware, validate({ body: updateSchema }), subscriptionController.update);
router.delete('/:id', authMiddleware, subscriptionController.delete);

module.exports = router;
