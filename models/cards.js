// models/user.js
const mongoose = require('mongoose');
const { URL_REGEX } = require('../middlewares/errors');

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
    validate: {
      validator: (v) => URL_REGEX.test(v),
      message: 'Некорректный URL',
    },
  },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: Array(mongoose.Types.ObjectId),
    ref: 'user',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// создаём модель и экспортируем её
module.exports = mongoose.model('card', cardSchema);
