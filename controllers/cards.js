// controllers/cards.js
// это файл контроллеров

const Card = require('../models/cards');

const ERROR_CODE = 400;
const NOT_FOUND_CODE = 404;
const SERVER_ERROR_CODE = 500;

const getAllCards = (req, res) => {
  Card.find({})
    .then((allCards) => res.send({ data: allCards }))
    .catch(() => res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' }));
};

const createCard = (req, res) => {
  const { name, link, owner } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
      }

      return res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete({ _id: cardId })
    .then(() => res.send({ message: 'Карточка удалена' }))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        return res.status(NOT_FOUND_CODE).send({
          message: 'Карточка с указанным _id не найдена',
        });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

const setLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные для постановки лайка',
        });
      }
      if (err.name === 'NotFoundError') {
        return res.status(NOT_FOUND_CODE).send({
          message: 'Передан несуществующий _id карточки',
        });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные для снятия лайка',
        });
      }
      if (err.name === 'NotFoundError') {
        return res.status(NOT_FOUND_CODE).send({
          message: 'Передан несуществующий _id карточки',
        });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  setLike,
  deleteLike,
};
