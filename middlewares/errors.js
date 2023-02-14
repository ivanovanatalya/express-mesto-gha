const ERROR_CODE = 400;
const UNAUTH_CODE = 401;
const UNAUTH_ERR = new Error();
UNAUTH_ERR.name = 'UnauthError';
UNAUTH_ERR.statusCode = UNAUTH_CODE;
UNAUTH_ERR.message = 'Необходима авторизация';
const FORBIDDEN_CODE = 403;
const FORBIDDEN_ERR = new Error();
FORBIDDEN_ERR.statusCode = FORBIDDEN_CODE;
FORBIDDEN_ERR.message = 'Действие запрещено';
const NOT_FOUND_CODE = 404;
const DATA_CONFLICT_CODE = 409;
const SERVER_ERROR_CODE = 500;
const NOT_FOUND_ERR = new Error();
NOT_FOUND_ERR.name = 'NotFoundError';
NOT_FOUND_ERR.statusCode = NOT_FOUND_CODE;
const GENERAL_ERR = new Error();
GENERAL_ERR.statusCode = ERROR_CODE;
const URL_REGEX = /https?:\/\/(?:www.)?[0-9A-z-._~:/?#[\]@!$&'()*+,;=]+/;

const errorHandler = (err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = SERVER_ERROR_CODE, message } = err;
  next();
  return res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === SERVER_ERROR_CODE
        ? 'На сервере произошла ошибка'
        : message,
    });
};

module.exports = {
  UNAUTH_ERR,
  FORBIDDEN_ERR,
  NOT_FOUND_ERR,
  DATA_CONFLICT_CODE,
  GENERAL_ERR,
  URL_REGEX,
  errorHandler,
};
