/**
 * Application error. Throw (or pass to next()) anywhere; the central error
 * handler turns it into the SAD 4.4 format: { error: { code, message, field? } }.
 *
 *   throw AppError.validation('title', 'Title must be at most 100 characters');
 *   throw AppError.accessDenied();
 *   throw new AppError(409, 'ALREADY_ATTEMPTED', 'You have already attempted this quiz');
 */
class AppError extends Error {
  constructor(status, code, message, field) {
    super(message);
    this.status = status;
    this.code = code;
    if (field) this.field = field;
  }

  static validation(field, message) {
    return new AppError(400, 'VALIDATION_ERROR', message, field);
  }

  static notAuthenticated(message = 'Not authenticated') {
    return new AppError(401, 'NOT_AUTHENTICATED', message);
  }

  static accessDenied(message = 'Access denied') {
    return new AppError(403, 'ACCESS_DENIED', message);
  }

  static notFound(message = 'Item unavailable') {
    return new AppError(404, 'NOT_FOUND', message);
  }

  static conflict(code, message) {
    return new AppError(409, code, message);
  }
}

module.exports = AppError;
