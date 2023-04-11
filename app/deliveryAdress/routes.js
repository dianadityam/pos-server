const router = require('express').Router();
const { police_check } = require('../../middlewares');
const addressController = require('./controller');

router.post('/address', police_check('create', 'DeliveryAddress'), addressController.store);

router.put('/address/:id', addressController.update);

router.get('/address', police_check('view', 'DeliveryAddress'), addressController.index);

router.delete('/address/:id', addressController.destroy);

module.exports = router;
