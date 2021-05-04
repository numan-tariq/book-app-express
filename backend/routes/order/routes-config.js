const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { isAuthenticated } = require('../../middleware/authenticated');
const { isAuthorized } = require('../../middleware/authorized');
const { USER_TYPES } = require('../../shared/common/constant');

router.get('', controller.getAllOrders);
router.get('/:id', controller.getOrderById);
router.post('', isAuthenticated, isAuthorized({hasRole: [USER_TYPES.ADMIN, USER_TYPES.CUSTOMER]}), controller.addOrder);
router.patch('/:id', isAuthenticated, isAuthorized({hasRole: [USER_TYPES.ADMIN, USER_TYPES.CUSTOMER]}), controller.updateOrder);
router.delete('/:id', isAuthenticated, isAuthorized({hasRole: [USER_TYPES.ADMIN, USER_TYPES.CUSTOMER]}), controller.deleteOrder);

module.exports = router;