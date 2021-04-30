const { handleError } = require('../../shared/common/helper');
const { validateLogin, validateSignup, User } = require('../../models/user.model');
const bcrypt = require('bcrypt');
const { USER_TYPES } = require('../../shared/common/constant');
const { Auther, Customer } = require('../../models');

/**
 * @description user login
 * @param {*} req 
 * @param {*} res 
 * @returns user
 */
exports.login = async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if(error) return res.status(400).send(error.details[0]);

    // Fetching user
    const user = await User.findOne({ email: req.body.email }).select('_id email userType');
    if(!user) return res.status(400).send({ message: 'Invalid Email or Password' });

    // Validatating Password
    const result = await bcrypt.compare(req.body.password, user.password);
    if(!result) return res.status(400).send({ message: 'Invalid Email or Password' });

    // Profile if exist
    if(user.userType === USER_TYPES.ADMIN) {
      user.profile = null;
    } else if(user.userType === USER_TYPES.AUTHER) {
      user.profile = await Auther.findOne({ userId: user._id });
    } else if(user.userType === USER_TYPES.CUSTOMER) {
      user.profile = await Customer.findOne({ userId: user._id });
    }

    return res.status(200).send(user);
  } catch (err) {
    return handleError(res, err);
  }
}

exports.signup = async (req, res) => {
  try {
    const { error } = validateSignup(req.body);
    if(error) return res.status(400).send(error.details[0]);

    // Check for existing email
    const user = await User.findOne({ email: req.body.email }).select('_id email userType');
    if(user) return res.status(409).send({ message: 'User with this email already exist' });


  } catch (err) {
    return handleError(res, err);
  }
}