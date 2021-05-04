const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { isAuthenticated } = require('../../middleware/authenticated');
const { isAuthorized } = require('../../middleware/authorized');
const { USER_TYPES } = require('../../shared/common/constant');

router.get('', controller.getAllPaymentTypes);
router.get('/:id', controller.getPaymentTypeById);
router.post('', isAuthenticated, isAuthorized({ hasRole: [USER_TYPES.ADMIN, USER_TYPES.CUSTOMER] }), controller.addPaymentType);
router.patch('/:id', isAuthenticated, isAuthorized({ hasRole: [USER_TYPES.ADMIN, USER_TYPES.CUSTOMER] }), controller.updatePaymentType);
router.delete('/:id', isAuthenticated, isAuthorized({ hasRole: [USER_TYPES.ADMIN, USER_TYPES.CUSTOMER] }), controller.deletePaymentType);

module.exports = router;