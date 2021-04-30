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
    let user = await User.findOne({ email: req.body.email }).select('_id email userType password');
    if(!user) return res.status(400).send({ message: 'Invalid Email or Password' });

    // Validatating Password
    const result = await bcrypt.compare(req.body.password, user.password);
    if(!result) return res.status(400).send({ message: 'Invalid Email or Password' });

    // Profile if exist
    let profile = null;
    if(user.userType === USER_TYPES.ADMIN) {
      profile = null;
    } else if(user.userType === USER_TYPES.AUTHER) {
      profile = await Auther.findOne({ user: user._id });
    } else if(user.userType === USER_TYPES.CUSTOMER) {
      profile = await Customer.findOne({ user: user._id });
    }

    user.password = undefined;
    return res.status(200).send({ ...user._doc, profile});
  } catch (err) {
    return handleError(res, err);
  }
}

/**
 * @description Add new user
 * @param {*} req 
 * @param {*} res 
 * @returns added user
 */
exports.signup = async (req, res) => {
  try {
    const { error } = validateSignup(req.body);
    if(error) return res.status(400).send(error.details[0]);

    // Check for existing email
    let user = await User.findOne({ email: req.body.email });
    if(user) return res.status(409).send({ message: 'User with this email already exist' });

    const hashedPassword = await bcrypt.hash(req.body.password, 13);
    if(!hashedPassword) return res.status(500).send({ message: 'Internal Server error.' });

    user = new User({ ...req.body, password: hashedPassword });
    user.save();

    user.profile = null;
    user.password = undefined;
    user.isDeleted = undefined;

    return res.status(201).send(user);
  } catch (err) {
    return handleError(res, err);
  }
}