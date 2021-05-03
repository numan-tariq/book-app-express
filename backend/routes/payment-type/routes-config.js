const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('', controller.getAllPaymentTypes);
router.get('/:id', controller.getPaymentTypeById);
router.post('', controller.addPaymentType);
router.patch('/:id', controller.updatePaymentType);
router.delete('/:id', controller.deletePaymentType);

module.exports = router;