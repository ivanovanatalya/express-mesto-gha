// controllers/users.js
// это файл контроллеров
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const { default: mongoose } = require('mongoose');
const User = require('../models/users');
const {
  GeneralError,
  DataConflictError,
  NotFoundError,
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
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      return res.send({ data: user });
    })
    .catch(
      (err) => {
        if (err instanceof mongoose.Error.CastError) {
          return next(new GeneralError('Передан некорректный _id'));
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
        throw new NotFoundError('Пользователь по указанному _id не найден');
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
    password: pass,
  } = req.body;

  bcrypt.hash(pass, 10)
    .then((hashPass) => User.create({
      name,
      about,
      avatar,
      email,
      password: hashPass,
    })
      .then((user) => {
        const { _doc: { password, ...userRes } } = user;
        res.send(userRes);
      })
      .catch((err) => {
        console.log(mongoose.Error)
        if (err instanceof mongoose.Error.ValidationError) {
          return next(new GeneralError('Переданы некорректные данные при создании пользователя'));
        }

        if (err.code === 11000) {
          return next(new DataConflictError('e-mail already exists'));
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
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new GeneralError('Переданы некорректные данные при создании пользователя'));
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
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new GeneralError('Переданы некорректные данные при создании пользователя'));
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new NotFoundError('Пользователь по указанному _id не найден'));
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
