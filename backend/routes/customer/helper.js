
const { Customer } = require('../../models')

exports.getCustomerById =  async (id) => {
  try {
    const customer = await Customer.findOne({_id: id, isDeleted: false}).populate([
      {
        path: "user",
        select: "_id email userType"
      }
    ])
    if(!customer) return null

    return customer;
  } catch (err) {
    return null;
  }
}