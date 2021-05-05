
const { Order } = require('../../models')

exports.getOrderById =  async (id) => {
  try {
    const order = await Order.findOne({_id: id, isDeleted: false}).populate([
      {
        path: "customer",
        select: "_id firstName lastName"
      },
      {
        path: "paymentType",
        select: "_id name discount"
      }
    ])
    if(!order) return null

    return order;
  } catch (err) {
    return null;
  }
}