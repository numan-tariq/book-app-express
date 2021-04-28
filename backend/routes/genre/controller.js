let genres = require('../../shared/data/genre.json');

/**
 * @description return all genres
 * @param {*} req 
 * @param {*} res 
 * @returns genres
 */
exports.getAllGenres = async (req, res) => {
  try {
    return res.status(200).send(genres);
  } catch (err) {
    return handleError(res, err);
  }
}

/**
 * @description return genre by ID
 * @param {*} req 
 * @param {*} res 
 * @returns genre
 */
exports.getGenreById = async (req, res) => {
  try {
    const { id } = req.params;
    const genre = genres.find(x => x.id === id);
    if(!genre) return res.status(404).send({ message: "Genre not found!" });

    return res.status(200).send(genre);
  } catch (err) {
    return handleError(res, err);
  }
}

/**
 * @description add genre
 * @param {*} req 
 * @param {*} res 
 * @returns new created genre
 */
exports.addGenre = async (req, res) => {
  try {
    const { name } = req.body;
    if(!name && name.length == 0) return res.status(400).send({ message: 'Name must be a string with length greather than 0'});

    const genre = {
      id: `${Math.floor(Math.random() * 100) + 4}`,
      name: name,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    genres.push(genre);
    return res.status(201).send(genre);
  } catch (err) {
    return handleError(res, err);
  }
}

/**
 * @description update genre
 * @param {*} req 
 * @param {*} res 
 * @returns updated genre
 */
exports.updateGenre = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if(!name && name.length == 0) return res.status(400).send({ message: 'Name must be a string with length greather than 0'});

    genres = genres.map(genre => {
      if(genre.id === id) {
        genre.name = name;
      }
      return genre;
    });

    return res.status(200).send(genres.find(x => x.id === id));
  } catch (err) {
    return handleError(res, err);
  }
}

/**
 * @description to delete a genre
 * @param {*} req 
 * @param {*} res 
 * @returns deleted genre
 */
exports.deleteGenre = async (req, res) => {
  try {
    const { id } = req.params;

    genres = genres.filter(genre => genre.id !== id);
    
    return res.status(200).send({ message: `Genre with ${id} is deleted successfully!` });
  } catch (err) {
    return handleError(res, err);
  }
}

function handleError(res, err) {
  return res.status(500).send({ message: `${err.code} - ${err.message}` });
}
