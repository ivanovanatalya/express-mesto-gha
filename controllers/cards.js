// controllers/cards.js
// это файл контроллеров

const Card = require('../models/cards');
const {
  NOT_FOUND_ERR,
  GENERAL_ERR,
} = require('../middlewares/errors');

const getAllCards = (req, res, next) => {
  Card.find({})
    .then((allCards) => res.send({ data: allCards }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id: owner } = req.user;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        GENERAL_ERR.name = err.name;
        GENERAL_ERR.message = 'Переданы некорректные данные при создании карточки';
        next(GENERAL_ERR);
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id: userId } = req.user;
  Card.findById({ _id: cardId })
    .then((card) => {
      if (!card || card.owner !== userId) {
        throw NOT_FOUND_ERR;
      }
    })
    .then(Card.deleteOne({ _id: cardId }))
    .then(() => res.send({ message: 'Карточка удалена' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        GENERAL_ERR.name = err.name;
        GENERAL_ERR.message = 'Карточка с указанным _id не найдена';
        next(GENERAL_ERR);
      }
      if (err.name === 'NotFoundError') {
        NOT_FOUND_ERR.message = 'Карточка с указанным _id не найдена';
        next(NOT_FOUND_ERR);
      }
      next(err);
    });
};

const setLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        throw NOT_FOUND_ERR;
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        GENERAL_ERR.name = err.name;
        GENERAL_ERR.message = 'Переданы некорректные данные для постановки лайка';
        next(GENERAL_ERR);
      }
      if (err.name === 'NotFoundError') {
        NOT_FOUND_ERR.message = 'Карточка с указанным _id не найдена';
        next(NOT_FOUND_ERR);
      }
      next(err);
    });
};

const deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        throw NOT_FOUND_ERR;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        GENERAL_ERR.name = err.name;
        GENERAL_ERR.message = 'Переданы некорректные данные для снятия лайка';
        next(GENERAL_ERR);
      }
      if (err.name === 'NotFoundError') {
        NOT_FOUND_ERR.message = 'Карточка с указанным _id не найдена';
        next(NOT_FOUND_ERR);
      }
      next(err);
    });
};

const wrongPath = (req, res, next) => {
  NOT_FOUND_ERR.message = 'Неверный путь';
  next(NOT_FOUND_ERR);
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  setLike,
  deleteLike,
  wrongPath,
};
