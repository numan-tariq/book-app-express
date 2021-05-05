const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { isAuthenticated } = require('../../middleware/authenticated');
const { isAuthorized } = require('../../middleware/authorized');
const { USER_TYPES } = require('../../shared/common/constant');

router.get('', controller.getAllCustomers);
router.get('/:id', controller.getCustomerById);
router.post('', isAuthenticated, isAuthorized({ hasRole: [USER_TYPES.CUSTOMER] }), controller.addCustomer);
router.patch('', isAuthenticated, isAuthorized({ hasRole: [USER_TYPES.CUSTOMER] }), controller.updateCustomer);
router.delete('/:id', isAuthenticated, isAuthorized({ hasRole: [USER_TYPES.ADMIN], allowSameUser: true }), controller.deleteCustomer);

module.exports = router;