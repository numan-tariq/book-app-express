const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('', controller.getAllOrders);
router.get('/:id', controller.getOrderById);
router.post('', controller.addOrder);
router.patch('/:id', controller.updateOrder);
router.delete('/:id', controller.deleteOrder);

module.exports = router;