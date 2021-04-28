let authers = require('../../shared/data/author.json');

/**
 * @description Return all authers
 * @param {*} req 
 * @param {*} res 
 * @returns authers
 */
exports.getAllAuther =  async (req, res) => {
  try {
    return res.status(200).send(authers);
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
    const auther = authers.find(x => x.id === id);
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

    const auther = {
      id: `${Math.floor(Math.random() * 100) + 4}`,
      name: name,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    authers.push(auther);
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
    const { name } = req.body;
    if(!name && name.length == 0) return res.status(400).send({ message: 'Name must be a string with length greather than 0'});
    
    authers = authers.map(auther => {
      if(auther.id === id) {
        auther.name = name;
      }
      return auther;
    });
    
    return res.status(200).send(authers.find(x => x.id === id));
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

    authers = authers.filter(auther => auther.id !== id);
    
    return res.status(200).send({ message: `Auther with ${id} is deleted successfully!` });
  } catch (err) {
    return handleError(res, err);
  }
}

function handleError(res, err) {
  return res.status(500).send({ message: `${err.code} - ${err.message}` });
}

