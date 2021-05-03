const { handleError } = require('../../shared/common/helper');
const { User } = require('../../models/user.model');
const { USER_TYPES } = require('../../shared/common/constant');
const { Auther, Customer } = require('../../models');

/**
 * @description Get user profile by token
 * @param {*} req 
 * @param {*} res 
 * @returns user
 */
 exports.getProfile = async (req, res) => {
  try {
    const { id } = res.locals;

    // Fetching User
    let user = await User.findOne({_id: id, isDeleted: false}).select('_id email userType');
    if(!user) return res.status(400).send({ message: 'Invalid Email or Password' });

    // Profile if exist
    let profile = null;
    if(user.userType === USER_TYPES.ADMIN) {
      profile = null;
    } else if(user.userType === USER_TYPES.AUTHER) {
      profile = await Auther.findOne({ user: user._id });
    } else if(user.userType === USER_TYPES.CUSTOMER) {
      profile = await Customer.findOne({ user: user._id });
    }

    return res.status(200).send({ ...user._doc, profile});
  } catch (err) {
    return handleError(res, err);
  }
}