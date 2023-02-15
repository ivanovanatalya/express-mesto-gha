// routes/cards.js
// это файл маршрутов
const express = require('express');

const router = express.Router();

const usersRouter = require('./users');
const cardsRouter = require('./cards');
const { NotFoundError } = require('../middlewares/errors');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.all('*', (req, res, next) => next(new NotFoundError('Неверный путь')));

module.exports = router;
