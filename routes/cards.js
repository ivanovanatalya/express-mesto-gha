// routes/cards.js
// это файл маршрутов
const express = require('express');
const { celebrate, Joi } = require('celebrate');

const router = express.Router();

const {
  getAllCards,
  createCard,
  deleteCard,
  setLike,
  deleteLike,
  wrongPath,
} = require('../controllers/cards');
const { URL_REGEX } = require('../middlewares/errors');

router.get('/cards', getAllCards);
router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(URL_REGEX),
  }),
}), createCard);
router.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), deleteCard);
router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), setLike);
router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), deleteLike);
router.all('*', wrongPath);

module.exports = router;
