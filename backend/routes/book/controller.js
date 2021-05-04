const { Auther, Genre } = require('../../models');
const { Book, validateAddBook, validateEditBook } = require('../../models/book.model')
const { mongoIdRegex } = require('../../shared/common/regex')
const helper = require('./helper')
const { handleError } = require('../../shared/common/helper');
const { USER_TYPES } = require('../../shared/common/constant');

/**
 * @description Return all books
 * @param {*} req 
 * @param {*} res 
 * @returns books
 */
exports.getAllBooks =  async (req, res) => {
  try {
    let { limit, offset } = req.query;

    if(!limit || !offset) {
      limit = '10';
      offset = '0';
    }

    const books = await Book.find({ isDeleted: false }).skip(parseInt(offset)).limit(parseInt(limit)).populate([
      {
        path: "auther",
        select: "_id name"
      }, 
      {
        path: "genre",
        select: "_id name"
      }
    ]);

    const totalBooks = await Book.count({ isDeleted: false });

    return res.status(200).send({ list: books, total: totalBooks });
  } catch (err) {
    return handleError(res, err);
  }
}

/**
 * @description Get Book by ID.
 * @param {*} req 
 * @param {*} res 
 * @returns Book
 */
exports.getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    if(!mongoIdRegex.test(id)) return res.status(404).send({ message: 'Book not Found!' });

    const book = await Book.findOne({_id: id, isDeleted: false}).populate([
      {
        path: "auther",
        select: "_id name"
      }, 
      {
        path: "genre",
        select: "_id name"
      }
    ]);
    if(!book) return res.status(404).send({ message: 'Book not Found'});

    return res.status(200).send(book);
  } catch (err) {
    return handleError(res, err);
  }
}

/**
 * @description Get all books by an Author
 * @param {*} req 
 * @param {*} res 
 * @returns books
 */
exports.getAllBooksOfAnAuthor = async (req, res) => {
  try {
    let { limit, offset } = req.query;
    if(!limit || !offset) {
      limit = '10';
      offset = '0'
    }

    const { id } = req.params;
    if(!mongoIdRegex.test(id)) return res.status(404).send({ message: 'Book not Found!' });

    const books = await Book.find({auther: id, isDeleted: false}).skip(parseInt(offset)).limit(parseInt(limit)).populate([
      {
        path: "auther",
        select: "_id name"
      }, 
      {
        path: "genre",
        select: "_id name"
      }
    ]);

    const totalBooks = books.length;

    return res.status(200).send({ list: books, total: totalBooks});
  } catch (err) {
    return handleError(res, err);
  }
}

/**
 * @description get all books by genre
 * @param {*} req 
 * @param {*} res 
 * @returns books
 */
exports.getAllBooksByGenre = async (req, res) => {
  try {
    let { limit, offset } = req.query;
    if(!limit || !offset) {
      limit = '10';
      offset = '0'
    }

    const { id } = req.params;
    if(!mongoIdRegex.test(id)) return res.status(404).send({ message: 'Genre not Found!' });

    const books = await Book.find({genre: id, isDeleted: false}).populate([
      {
        path: "auther",
        select: "_id name"
      }, 
      {
        path: "genre",
        select: "_id name"
      }
    ]);

    const totalBooks = books.length;

    return res.status(200).send({ list: books, total: totalBooks});
  } catch (err) {
    return handleError(res, err);
  }
}
/**
 * @description Add Book
 * @param {*} req 
 * @param {*} res 
 * @returns new created Book
 */
exports.addBook = async (req, res) => {
  try {
    const { id, userType } = res.locals;
    let autherId = id;

    const { error } = validateAddBook(req.body);
    if(error) return res.status(400).send(error.details[0]);

    if(userType === USER_TYPES.ADMIN) {
      autherId = req.body.auther;
    }

    const auther = await Auther.findOne({_id: autherId, isDeleted: false});
    if(!auther) return res.status(400).send({ message: "Invalid Auther ID"});

    const genre = await Genre.findOne({_id: req.body.genre, isDeleted: false});
    if(!genre) return res.status(400).send({ message: "Invalid Genre ID"});

    let book = new Book({ ...req.body, auther: autherId });
    await book.save();

    book = await helper.getBookById(book._id);

    return res.status(201).send(book);
  } catch (err) {
    return handleError(res, err);
  }
}

/**
 * @description Update Book
 * @param {*} req 
 * @param {*} res 
 * @returns updated Book
 */
exports.updateBook = async (req, res) => {
  try {
    const { id, userType } = res.locals;
    let autherId = id;

    const bookId = req.params.id;
    if(!mongoIdRegex.test(bookId)) return res.status(404).send({ message: 'Book not Found!' });

    const { error } = validateEditBook(req.body);
    if(error) return res.status(400).send(error.details[0]);

    // Fetching book
    let book = await Book.findOne({_id: bookId, isDeleted: false}).select('auther');

    if(userType === USER_TYPES.AUTHER && book.auther !== autherId) {
      return res.stauts(403).send({ message: "Forbidden" });
    }

    book = await Book.findOneAndUpdate({_id: bookId, isDeleted: false}, { ...req.body ,updatedAt: new Date() }, {new: true}).populate([
      {
        path: "auther",
        select: "_id name"
      }, 
      {
        path: "genre",
        select: "_id name"
      }
    ]);

    return res.status(200).send(book);
  } catch (err) {
    return handleError(res, err);
  }
}

/**
 * @description to delete an Book
 * @param {*} req 
 * @param {*} res 
 * @returns Book deleted
 */
exports.deleteBook = async (req, res) => {
  try {
    const { id, userType } = res.locals;
    let autherId = id;

    const bookId = req.params.id;

    // Fetching book
    let book = await Book.findOne({_id: bookId, isDeleted: false}).select('auther');

    if(userType === USER_TYPES.AUTHER && book.auther !== autherId) {
      return res.stauts(403).send({ message: "Forbidden" });
    }

    book = await Book.findByIdAndUpdate(bookId, {isDeleted: true}, {new: true});
    if(!book) return res.status(404).send({ message: 'Book not found!'});

    return res.status(200).send({ message: `Book with name ${book.title} is deleted successfully!` });
  } catch (err) {
    return handleError(res, err);
  }
}