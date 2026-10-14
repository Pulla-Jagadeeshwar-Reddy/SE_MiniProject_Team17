const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

/**
 * Put after express-validator rules:
 *   router.post('/', rules, validate, controller.create)
 * Rejects with the FIRST failing field and its rule, before the controller
 * runs, so a rejected request never changes data (SAD 4.4).
 */
function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  const first = result.array({ onlyFirstError: true })[0];
  return next(AppError.validation(first.path, first.msg));
}

module.exports = validate;
