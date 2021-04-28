
const { Book } = require('../../models')
exports.getBookById =  async (id) => {
  try {
    const book = await Book.findOne({_id: id, isDeleted: false}).populate([
      {
        path: "auther",
        select: "_id name"
      }, 
      {
        path: "genre",
        select: "_id name"
      }
    ])
    if(!book) return null
    
    return book;
  } catch (err) {
    return null;
  }
}