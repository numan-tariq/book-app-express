const { Auther } = require('../../models')
const { mongoIdRegex } = require('../../shared/common/regex')
const helper = require('./helper')
const { handleError } = require('../../shared/common/helper')

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
        select: "_id email"
      }
    ])

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
exports.getAutherById = async (req, res) => {
  try {
    const { id } = req.params;
    if(!mongoIdRegex.test(id)) return res.status(404).send({ message: 'Author not Found!' });

    const auther = await Auther.findOne({_id: id, isDeleted: false}).populate([
      {
        path: 'user',
        select: "_id email"
      }
    ]);
    if(!auther) return res.status(404).send({ message: 'Auther not Found'});

    return res.status(200).send(auther);
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
    const { name } = req.body;
    if(!name && name.length == 0) return res.status(400).send({ message: 'Name must be a string with length greather than 0'});

    let auther = new Auther({ name });
    await auther.save();

    auther = await helper.getBookById(auther._id);

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
    const { id } = req.params;
    if(!mongoIdRegex.test(id)) return res.status(404).send({ message: 'Author not Found!' });

    const { name } = req.body;
    if(!name && name.length == 0) return res.status(400).send({ message: 'Name must be a string with length greather than 0'});
    
    const auther = await Auther.findOneAndUpdate({_id: id, isDeleted: false}, { name, updatedAt: new Date() }, {new: true}).populate([
      {
        path: 'user',
        select: "_id email"
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
    
    return res.status(200).send({ message: `Auther with name ${auther.name} is deleted successfully!` });
  } catch (err) {
    return handleError(res, err);
  }
}