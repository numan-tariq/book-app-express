const { Customer, validateAddCustomer, validateEditCustomer } = require('../../models/cutomer.model');
const { handleError } = require('../../shared/common/helper')
const { mongoIdRegex } = require('../../shared/common/regex')
const helper = require('./helper')

/**
 * @description Return all Customers
 * @param {*} req 
 * @param {*} res 
 * @returns Customers
 */
exports.getAllCustomers = async (req, res) => {
  try {
    let { limit, offset } = req.query;

    if(!limit || !offset) {
      limti = '10';
      offset = '0'
    }

    const customers = await Customer.find({ isDeleted: false }).skip(parseInt(offset)).limit(parseInt(limit)).populate([
      {
        path: 'user',
        select: "_id email userType"
      }
    ])

    const totalCustomers = await Customer.count({ isDeleted: false });

    return res.status(200).send({ list: customers, total: totalCustomers });
  } catch (err) {
    return handleError(res, err);
  }
}

/**
 * @description Get Customer by ID.
 * @param {*} req 
 * @param {*} res 
 * @returns Customer
 */
 exports.getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    if(!mongoIdRegex.test(id)) return res.status(404).send({ message: 'Customer not Found!' });

    const customer = await Customer.findOne({_id: id, isDeleted: false}).populate([
      {
        path: 'user',
        select: "_id email userType"
      }
    ]);
    if(!customer) return res.status(404).send({ message: 'Customer not Found'});

    return res.status(200).send(customer);
  } catch (err) {
    return handleError(res, err);
  }
}

/**
 * @description Add Customer
 * @param {*} req 
 * @param {*} res 
 * @returns new created Customer
 */
exports.addCustomer = async (req, res) => {
  try {
    const { error } = validateAddCustomer(req.body);
    if(error) return res.status(400).send(error.details[0]);

    let customer = new Customer({ ...req.body });
    await customer.save();

    customer = await helper.getCustomerById(customer._id);

    return res.status(201).send(customer);
  } catch (err) {
    return handleError(res, err);
  }
}

/**
 * @description Update Customer
 * @param {*} req 
 * @param {*} res 
 * @returns updated Customer
 */
exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    if(!mongoIdRegex.test(id)) return res.status(404).send({ message: 'Customer not Found!' });

    const { firstName, lastName } = req.body;
    if((!firstName && firstName.length == 0) || (!lastName && lastName.length == 0)) return res.status(400).send({ message: 'Name must be a string with length greather than 0'});
    
    const customer = await Customer.findOneAndUpdate({_id: id, isDeleted: false}, { firstName, lastName, updatedAt: new Date() }, {new: true}).populate([
      {
        path: 'user',
        select: "_id email userType"
      }
    ]);

    return res.status(200).send(customer);
  } catch (err) {
    return handleError(res, err);
  }
}

/**
 * @description to delete an Customer
 * @param {*} req 
 * @param {*} res 
 * @returns Customer deleted
 */
exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByIdAndUpdate(id, {isDeleted: true}, {new: true});
    if(!customer) return res.status(404).send({ message: 'Customer not found!'});
    
    return res.status(200).send({ message: `Customer with name ${customer.firstName} is deleted successfully!` });
  } catch (err) {
    return handleError(res, err);
  }
}