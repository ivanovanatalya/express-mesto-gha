const ERROR_CODE = 400;
const UNAUTH_CODE = 401;
const NOT_FOUND_CODE = 404;
const SERVER_ERROR_CODE = 500;
const NOT_FOUND_ERR = new Error();
NOT_FOUND_ERR.name = 'NotFoundError';
NOT_FOUND_ERR.statusCode = NOT_FOUND_CODE;
const GENERAL_ERR = new Error();
GENERAL_ERR.statusCode = ERROR_CODE;

const errors = (err, req, res) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  return res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
};

module.exports = {
  ERROR_CODE,
  UNAUTH_CODE,
  NOT_FOUND_CODE,
  SERVER_ERROR_CODE,
  NOT_FOUND_ERR,
  GENERAL_ERR,
  errors,
};
