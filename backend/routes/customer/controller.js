const { Customer, validateAddCustomer, validateEditCustomer } = require('../../models/cutomer.model');
const { handleError } = require('../../shared/common/helper');
const { mongoIdRegex } = require('../../shared/common/regex');
const helper = require('./helper');
const { User } = require('../../models/user.model');

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

    const user = await User.findOne({_id: id, isDeleted: false}).select("_id email userType");
    if(!user) return res.status(404).send({ message: 'Customer not Found'});

    let profile = null;
    profile = await Customer.findOne({user: id});

    return res.status(200).send({ ...user._doc, profile });
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
    const { id } = res.locals;

    const { error } = validateAddCustomer(req.body);
    if(error) return res.status(400).send(error.details[0]);

    let customer = new Customer({ ...req.body, user: id });
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
    const { id } = res.locals;
    if(!mongoIdRegex.test(id)) return res.status(404).send({ message: 'Customer not Found!' });

    const { error } = validateEditCustomer(req.body);
    if(error) return res.status(400).send(error.details[0]);
    
    const customer = await Customer.findOneAndUpdate({ user: id, isDeleted: false}, { ...req.body, updatedAt: new Date() }, {new: true, useFindAndModify: false}).populate([
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