// routes/users.js
// это файл маршрутов
const express = require('express');
const { celebrate, Joi } = require('celebrate');

const usersRouter = express.Router();

const {
  getAllUsers,
  getUser,
  getCurrentUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');
const { URL_REGEX } = require('../middlewares/errors');

usersRouter.get('/', getAllUsers);
usersRouter.get('/me', getCurrentUser);
usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);
usersRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
}), getUser);
usersRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(URL_REGEX),
  }),
}), updateAvatar);

module.exports = usersRouter;
