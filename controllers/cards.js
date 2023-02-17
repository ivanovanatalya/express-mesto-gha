// controllers/cards.js
// это файл контроллеров
const { mongoose } = require('mongoose');
const Card = require('../models/cards');
const {
  CREATED_CODE,
  NotFoundError,
  ForbiddenError,
  GeneralError,
} = require('../middlewares/errors');

const getAllCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((allCards) => res.send({ data: allCards }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id: owner } = req.user;
  Card.create({ name, link, owner })
    .then((card) => res.status(CREATED_CODE).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new GeneralError('Переданы некорректные данные при создании карточки'));
      }
      return next(err);
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id: userId } = req.user;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      if (!card.owner.equals(userId)) {
        throw new ForbiddenError();
      }
      return Card.findByIdAndDelete(cardId);
    })
    .then(() => res.send({ message: 'Карточка удалена' }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new GeneralError('Карточка с указанным _id не найдена'));
      }
      return next(err);
    });
};

const setLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new GeneralError('Переданы некорректные данные для постановки лайка'));
      }
      return next(err);
    });
};

const deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new GeneralError('Переданы некорректные данные для снятия лайка'));
      }
      return next(err);
    });
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  setLike,
  deleteLike,
};
