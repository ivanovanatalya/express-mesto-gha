// controllers/users.js
// это файл контроллеров

const User = require('../models/users');

const ERROR_CODE = 400;
const NOT_FOUND_CODE = 404;
const SERVER_ERROR_CODE = 500;
let NOT_FOUND_ERR = new Error();
NOT_FOUND_ERR.name = "NotFoundError";

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
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        return res.status(NOT_FOUND_CODE).send({
          message: 'Пользователь по указанному _id не найден',
        });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      }

      return res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { name, about } }, // добавить _id в массив, если его там нет
    { new: true },
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
    { new: true },
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

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
