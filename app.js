// app.js — входной файл

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

// подключаем мидлвары, роуты и всё остальное...

app.use(bodyParser.json()); // для собирания JSON-формата

app.use((req, res, next) => {
  req.user = {
    _id: '63e3870a1b58ad93fe3db2c4', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

const userRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');

app.use(userRoutes);
app.use(cardsRoutes);

app.listen(3000);
