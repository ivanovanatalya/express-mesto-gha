// middlewares/auth.js

const jwt = require('jsonwebtoken');
const { UNAUTH_ERR } = require('./errors');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(UNAUTH_ERR);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(UNAUTH_ERR);
  }
  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};

module.exports = auth;
