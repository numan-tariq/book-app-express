const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { isAuthenticated } = require('../../middleware/authenticated');
const { isAuthorized } = require('../../middleware/authorized');
const { USER_TYPES } = require('../../shared/common/constant');

router.get('', isAuthenticated, isAuthorized({hasRole: [USER_TYPES.ADMIN]}), controller.getAllOrders);
router.get('/:id', isAuthenticated, isAuthorized({hasRole: [USER_TYPES.ADMIN, USER_TYPES.CUSTOMER] }), controller.getOrderById);
router.post('', isAuthenticated, isAuthorized({hasRole: [USER_TYPES.ADMIN, USER_TYPES.CUSTOMER]}), controller.addOrder);
router.patch('/:id', isAuthenticated, isAuthorized({hasRole: [USER_TYPES.ADMIN]}), controller.updateOrder);
router.delete('/:id', isAuthenticated, isAuthorized({hasRole: [USER_TYPES.ADMIN] }), controller.deleteOrder);

module.exports = router;