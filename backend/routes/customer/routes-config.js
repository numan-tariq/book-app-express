const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('', controller.getAllCustomers);
router.get('/:id', controller.getCustomerById);
router.post('', controller.addCustomer);
router.patch('/:id', controller.updateCustomer);
router.delete('/:id', controller.deleteCustomer);

module.exports = router;