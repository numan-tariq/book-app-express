const { Auther, validateAddAuther, validateEditAuther } = require('../../models/auther.model')
const { mongoIdRegex } = require('../../shared/common/regex')
const helper = require('./helper')
const { handleError } = require('../../shared/common/helper')
const { User } = require('../../models')

/**
 * @description Return all authers
 * @param {*} req 
 * @param {*} res 
 * @returns authers
 */
exports.getAllAuther =  async (req, res) => {
  try {
    let { limit, offset } = req.query;
    
    if(!limit || !offset) {
      limti = '10';
      offset = '0'
    }

    const authersList = await Auther.find({ isDeleted: false }).skip(parseInt(offset)).limit(parseInt(limit)).populate([
      {
        path: 'user',
        select: "_id email userType"
      }
    ]);

    const totalAuthers = await Auther.count({ isDeleted: false });

    return res.status(200).send({ list: authersList, total: totalAuthers });
  } catch (err) {
    return handleError(res, err);
  }
}

/**
 * @description Get Auther by ID.
 * @param {*} req 
 * @param {*} res 
 * @returns auther
 */
exports.getAutherByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    if(!mongoIdRegex.test(id)) return res.status(404).send({ message: 'Author not Found!' });

    const user = await User.findOne({_id: id, isDeleted: false}).select("_id email userType");
    if(!user) return res.status(404).send({ message: 'Auther not Found'});

    let profile = null;
    profile = await Auther.findOne({user: id});

    return res.status(200).send({ ...user._doc, profile });
  } catch (err) {
    return handleError(res, err);
  }
}

/**
 * @description Add auther
 * @param {*} req 
 * @param {*} res 
 * @returns new created auther
 */
exports.addAuther = async (req, res) => {
  try {
    const { id } = res.locals;

    const { error } = validateAddAuther(req.body);
    if(error) return res.status(400).send(error.details[0]);

    let auther = new Auther({ ...req.body, user: id });
    await auther.save();

    auther = await helper.getAutherById(auther._id);

    return res.status(201).send(auther);
  } catch (err) {
    return handleError(res, err);
  }
}

/**
 * @description Update Author
 * @param {*} req 
 * @param {*} res 
 * @returns updated author
 */
exports.updateAuther = async (req, res) => {
  try {
    const { id } = res.locals;
    if(!mongoIdRegex.test(id)) return res.status(404).send({ message: 'Author not Found!' });

    const { error } = validateEditAuther(req.body);
    if(error) return res.status(400).send(error.details[0]);
    
    const auther = await Auther.findOneAndUpdate({ user: id, isDeleted: false}, { ...req.body, updatedAt: new Date() }, {new: true, useFindAndModify: false }).populate([
      {
        path: 'user',
        select: "_id email userType"
      }
    ]);

    return res.status(200).send(auther);
  } catch (err) {
    return handleError(res, err);
  }
}

/**
 * @description to delete an Author
 * @param {*} req 
 * @param {*} res 
 * @returns author deleted
 */
exports.deleteAuthor = async (req, res) => {
  try {
    const { id } = req.params;

    const auther = await Auther.findByIdAndUpdate(id, {isDeleted: true}, {new: true});
    if(!auther) return res.status(404).send({ message: 'Auther not found!'});
    
    return res.status(200).send({ message: `Auther with name ${auther.firstName} is deleted successfully!` });
  } catch (err) {
    return handleError(res, err);
  }
}