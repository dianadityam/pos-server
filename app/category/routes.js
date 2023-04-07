const router = require('express').Router();
const categoryController = require('./controller');
const { police_check } = require('../../middlewares');

router.post(
    '/categories',
    // police_check('create', 'Category'),
    categoryController.store
);
router.get('/categories', categoryController.index);
router.put('/categories/:id', police_check('update', 'Product'), categoryController.update);
router.delete('/categories/:id', police_check('delete', 'Product'), categoryController.destroy);

module.exports = router;
