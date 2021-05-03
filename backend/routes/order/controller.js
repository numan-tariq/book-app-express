const { Order, validateAddOrder, validateEditOrder } = require('../../models/order.model');
const { handleError } = require('../../shared/common/helper')
const { mongoIdRegex } = require('../../shared/common/regex')
const helper = require('./helper')

/**
 * @description Return all Orders
 * @param {*} req 
 * @param {*} res 
 * @returns Orders
 */
exports.getAllOrders = async (req, res) => {
  try {
    let { limit, offset } = req.query;
    if(!limit || !offset) {
      limit = '10';
      offset = '0'
    }

    const orders = await Order.find({ isDeleted: false }).skip(parseInt(offset)).limit(parseInt(limit)).populate([
      {
        path: 'customer',
        select: "_id firstName lastName"
      },
      {
        path: 'paymentType',
        select: "_id name discount"
      }
    ]);

    const totalOrders = await Order.count({ isDeleted: false });

    return res.status(200).send({ list: orders, total: totalOrders });
  } catch (err) {
    return handleError(res, err);
  }
}

/**
 * @description Get Order by ID.
 * @param {*} req 
 * @param {*} res 
 * @returns Order
 */
 exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    if(!mongoIdRegex.test(id)) return res.status(404).send({ message: 'Order not Found!' });

    const order = await Order.findOne({_id: id, isDeleted: false}).populate([
      {
        path: 'customer',
        select: "_id firstName lastName"
      },
      {
        path: 'paymentType',
        select: "_id name discount"
      }
    ]);
    if(!order) return res.status(404).send({ message: 'Order not Found'});

    return res.status(200).send(order);
  } catch (err) {
    return handleError(res, err);
  }
}

/**
 * @description Add Order
 * @param {*} req 
 * @param {*} res 
 * @returns new created Order
 */
exports.addOrder = async (req, res) => {
  try {
    const { error } = validateAddOrder(req.body);
    if(error) return res.status(400).send(error.details[0]);

    let order = new Order({ ...req.body });
    await order.save();

    order = await helper.getOrderById(order._id);

    return res.status(201).send(order);
  } catch (err) {
    return handleError(res, err);
  }
}

/**
 * @description Update Order
 * @param {*} req 
 * @param {*} res 
 * @returns updated Order
 */
exports.updateOrder = async (req, res) => { //Pending
  try {
    const { id } = req.params;
    if(!mongoIdRegex.test(id)) return res.status(404).send({ message: 'Order not Found!' });

    const { discount } = req.body;
    if(!discount && discount < 0 && discount > 100) return res.status(400).send({ message: 'Discount must be between 0 to 100'});
    
    const order = await Order.findOneAndUpdate({_id: id, isDeleted: false}, { discount, updatedAt: new Date() }, {new: true}).populate([
      {
        path: 'customer',
        select: "_id firstName lastName"
      },
      {
        path: 'paymentType',
        select: "_id name discount"
      }
    ]);

    return res.status(200).send(order);
  } catch (err) {
    return handleError(res, err);
  }
}

/**
 * @description to delete an Order
 * @param {*} req 
 * @param {*} res 
 * @returns Order deleted
 */
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByIdAndUpdate(id, {isDeleted: true}, {new: true});
    if(!order) return res.status(404).send({ message: 'Order not found!'});
    
    return res.status(200).send({ message: `Order is deleted successfully!` });
  } catch (err) {
    return handleError(res, err);
  }
}