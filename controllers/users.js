// controllers/users.js
// это файл контроллеров
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const User = require('../models/users');
const {
  NOT_FOUND_ERR,
  GENERAL_ERR,
  DATA_CONFLICT_CODE,
} = require('../middlewares/errors');

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((allUsers) => res.send({ data: allUsers }))
    .catch(next);
};

const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (user === null) {
        NOT_FOUND_ERR.message = 'Пользователь по указанному _id не найден';
        throw NOT_FOUND_ERR;
      }
      return res.send({ data: user });
    })
    .catch(
      (err) => {
        if (err.name === 'CastError') {
          GENERAL_ERR.name = err.name;
          GENERAL_ERR.message = 'Передан некорректный _id';
          return next(GENERAL_ERR);
        }
        return next(err);
      },
    );
};

const getCurrentUser = (req, res, next) => {
  const { _id: userId } = req.user;
  User.findById(userId)
    .then((user) => {
      if (user === null) {
        throw NOT_FOUND_ERR;
      }
      return res.send({ data: user });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
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
      password: hashPass,
    })
      .then((user) => {
        const { password: psw, ...userRes } = user;
        res.send(userRes);
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          GENERAL_ERR.name = err.name;
          GENERAL_ERR.message = 'Переданы некорректные данные при создании пользователя';
          return next(GENERAL_ERR);
        }

        if (err.code === 11000) {
          const duplicateErr = new Error();
          duplicateErr.statusCode = DATA_CONFLICT_CODE;
          duplicateErr.message = 'e-mail already exists';
          return next(duplicateErr);
        }
        return next(err);
      }));
};

const updateUser = (req, res, next) => {
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
        GENERAL_ERR.name = err.name;
        GENERAL_ERR.message = 'Переданы некорректные данные при создании пользователя';
        return next(GENERAL_ERR);
      }
      if (err.name === 'NotFoundError') {
        NOT_FOUND_ERR.name = err.name;
        NOT_FOUND_ERR.message = 'Пользователь по указанному _id не найден';
        return next(NOT_FOUND_ERR);
      }
      return next(err);
    });
};

const updateAvatar = (req, res, next) => {
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
        GENERAL_ERR.name = err.name;
        GENERAL_ERR.message = 'Переданы некорректные данные при создании пользователя';
        return next(GENERAL_ERR);
      }
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        NOT_FOUND_ERR.name = err.name;
        NOT_FOUND_ERR.message = 'Пользователь по указанному _id не найден';
        return next(NOT_FOUND_ERR);
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: 7200 });
      return res.send({ token });
    })
    .catch(next);
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
