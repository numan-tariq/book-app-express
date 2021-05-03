const { PaymentType, validateAddPaymentType, validateEditPaymentType } = require('../../models/payment-type.model');
const { handleError } = require('../../shared/common/helper')
const { mongoIdRegex } = require('../../shared/common/regex')

/**
 * @description Return all PaymentTypes
 * @param {*} req 
 * @param {*} res 
 * @returns PaymentTypes
 */
exports.getAllPaymentTypes = async (req, res) => {
  try {
    const paymentTypes = await PaymentType.find({ isDeleted: false });

    const totalPaymentTypes = await PaymentType.count({ isDeleted: false });

    return res.status(200).send({ list: paymentTypes, total: totalPaymentTypes });
  } catch (err) {
    return handleError(res, err);
  }
}

/**
 * @description Get PaymentType by ID.
 * @param {*} req 
 * @param {*} res 
 * @returns PaymentType
 */
 exports.getPaymentTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    if(!mongoIdRegex.test(id)) return res.status(404).send({ message: 'PaymentType not Found!' });

    const paymentType = await PaymentType.findOne({_id: id, isDeleted: false});
    if(!paymentType) return res.status(404).send({ message: 'PaymentType not Found'});

    return res.status(200).send(paymentType);
  } catch (err) {
    return handleError(res, err);
  }
}

/**
 * @description Add PaymentType
 * @param {*} req 
 * @param {*} res 
 * @returns new created PaymentType
 */
exports.addPaymentType = async (req, res) => {
  try {
    const { error } = validateAddPaymentType(req.body);
    if(error) return res.status(400).send(error.details[0]);

    let paymentType = new PaymentType({ ...req.body });
    await paymentType.save();

    paymentType.isDeleted = undefined;

    return res.status(201).send(paymentType);
  } catch (err) {
    return handleError(res, err);
  }
}

/**
 * @description Update PaymentType
 * @param {*} req 
 * @param {*} res 
 * @returns updated PaymentType
 */
exports.updatePaymentType = async (req, res) => {
  try {
    const { id } = req.params;
    if(!mongoIdRegex.test(id)) return res.status(404).send({ message: 'PaymentType not Found!' });

    const { name } = req.body;
    if(!name && name.length == 0) return res.status(400).send({ message: 'Name must be a string with length greather than 0'});
    
    const paymentType = await PaymentType.findOneAndUpdate({_id: id, isDeleted: false}, { name, updatedAt: new Date() }, {new: true});

    return res.status(200).send(paymentType);
  } catch (err) {
    return handleError(res, err);
  }
}

/**
 * @description to delete an PaymentType
 * @param {*} req 
 * @param {*} res 
 * @returns PaymentType deleted
 */
exports.deletePaymentType = async (req, res) => {
  try {
    const { id } = req.params;

    const paymentType = await PaymentType.findByIdAndUpdate(id, {isDeleted: true}, {new: true});
    if(!paymentType) return res.status(404).send({ message: 'PaymentType not found!'});
    
    return res.status(200).send({ message: `PaymentType with name ${paymentType.name} is deleted successfully!` });
  } catch (err) {
    return handleError(res, err);
  }
}