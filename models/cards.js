// models/user.js

const mongoose = require('mongoose');
// Опишем схему:
const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: Array(mongoose.Types.ObjectId),
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// создаём модель и экспортируем её
module.exports = mongoose.model('card', cardSchema);
