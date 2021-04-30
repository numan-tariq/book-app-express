
const { Auther } = require('../../models')
exports.getBookById =  async (id) => {
  try {
    const auther = await Auther.findOne({_id: id, isDeleted: false}).populate([
      {
        path: "user",
        select: "_id email userType"
      }
    ])
    if(!auther) return null
    
    return auther;
  } catch (err) {
    return null;
  }
}