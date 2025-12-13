const express = require('express');
const subscriptionPlanController = require('../controllers/subscriptionPlan.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { createSchema, updateSchema } = require('../validators/subscriptionPlan.validator');

const router = express.Router();

router.get('/', authMiddleware, subscriptionPlanController.getAll);
router.get('/:id', authMiddleware, subscriptionPlanController.getOne);
router.post('/', authMiddleware, validate({ body: createSchema }), subscriptionPlanController.create);
router.put('/:id', authMiddleware, validate({ body: updateSchema }), subscriptionPlanController.update);
router.delete('/:id', authMiddleware, subscriptionPlanController.delete);

module.exports = router;
