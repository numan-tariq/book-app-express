const mongoose = require('mongoose');

const Genre = mongoose.model('genre', mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 30
  },
  isDeleted: {
    type: Boolean,
    default: false,
    select: false
  }
}, { versionKey: false, timestamps: true  }))

exports.Genre = Genre;