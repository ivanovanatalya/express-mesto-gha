const ERROR_CODE = 400;
const UNAUTH_CODE = 401;
const NOT_FOUND_CODE = 404;
const SERVER_ERROR_CODE = 500;
const NOT_FOUND_ERR = new Error();
NOT_FOUND_ERR.name = 'NotFoundError';

module.exports = {
  ERROR_CODE,
  UNAUTH_CODE,
  NOT_FOUND_CODE,
  SERVER_ERROR_CODE,
  NOT_FOUND_ERR,
};
