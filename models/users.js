// models/user.js
const validator = require('validator');
const mongoose = require('mongoose');
// Опишем схему:
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL',
    },
  },
});

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
