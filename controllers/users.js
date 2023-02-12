// controllers/users.js
// это файл контроллеров
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const User = require('../models/users');
const {
  ERROR_CODE,
  UNAUTH_CODE,
  NOT_FOUND_CODE,
  NOT_FOUND_ERR,
  SERVER_ERROR_CODE,
} = require('../constants');

const getAllUsers = (req, res) => {
  User.find({})
    .then((allUsers) => res.send({ data: allUsers }))
    .catch(() => res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' }));
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (user === null) {
        throw NOT_FOUND_ERR;
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE).send({
          message: 'Передан некорректный _id',
        });
      }
      if (err.name === 'NotFoundError') {
        return res.status(NOT_FOUND_CODE).send({
          message: 'Пользователь по указанному _id не найден',
        });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

const getCurrentUser = (req, res) => {
  const { _id: userId } = req.user;
  User.findById(userId)
    .then((user) => {
      if (user === null) {
        throw NOT_FOUND_ERR;
      }
      return res.send({ data: user });
    })
    .catch(() => res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' }));
};

const createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hashPass) => User.create({
      name,
      about,
      avatar,
      email,
      hashPass,
    })
      .then((user) => res.send({ data: user }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          return res.status(ERROR_CODE).send({
            message: 'Переданы некорректные данные при создании пользователя',
          });
        }
        
        return res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
      }));
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { name, about } }, // добавить _id в массив, если его там нет
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user === null) {
        throw NOT_FOUND_ERR;
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
      }
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        return res.status(NOT_FOUND_CODE).send({
          message: 'Пользователь по указанному _id не найден',
        });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { $set: { avatar } }, // добавить _id в массив, если его там нет
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user === null) {
        throw NOT_FOUND_ERR;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные при обновлении аватара',
        });
      }
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        return res.status(NOT_FOUND_CODE).send({
          message: 'Пользователь по указанному _id не найден',
        });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: 7200 });
      return res.send({ token });
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        return res.status(UNAUTH_CODE).send({
          message: 'Пользователь не найден',
        });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  getAllUsers,
  getUser,
  getCurrentUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
