// routes/cards.js
// это файл маршрутов
const express = require('express');

const router = express.Router();

const {
  getAllCards,
  createCard,
  deleteCard,
  setLike,
  deleteLike,
} = require('../controllers/cards');

router.get('/cards', getAllCards);
router.post('/cards', createCard);
router.delete('/cards/:cardId', deleteCard);
router.put('/cards/:cardId/likes', setLike);
router.delete('/cards/:cardId/likes', deleteLike);

module.exports = router;
