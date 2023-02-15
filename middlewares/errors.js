const CREATED_CODE = 201;
class GeneralError extends Error {
  constructor() {
    super();
    this.name = 'GeneralError';
    this.statusCode = 400;
    this.message = 'error';
  }
}

class UnauthError extends Error {
  constructor() {
    super();
    this.name = 'UnauthError';
    this.statusCode = 401;
    this.message = 'Необходима авторизация';
  }
}

class ForbiddenError extends Error {
  constructor() {
    super();
    this.name = 'ForbiddenError';
    this.statusCode = 403;
    this.message = 'Действие запрещено';
  }
}

class NotFoundError extends Error {
  constructor() {
    super();
    this.name = 'NotFoundError';
    this.statusCode = 404;
    this.message = 'not found';
  }
}

class DataConflictError extends Error {
  constructor() {
    super();
    this.name = 'DataConflictError';
    this.statusCode = 409;
    this.message = 'data conflict';
  }
}

const SERVER_ERROR_CODE = 500;
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
  GeneralError,
  CREATED_CODE,
  UnauthError,
  ForbiddenError,
  NotFoundError,
  DataConflictError,
  URL_REGEX,
  errorHandler,
};
