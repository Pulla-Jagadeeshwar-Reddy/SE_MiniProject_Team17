const AppError = require('../utils/AppError');

/**
 * Role-based access control, deny by default.
 *   router.post('/', authenticate, requireRole(ROLES.FACULTY), ...)
 */
function requireRole(...allowed) {
  return (req, res, next) => {
    if (!req.user || !allowed.includes(req.user.role)) {
      return next(AppError.accessDenied());
    }
    return next();
  };
}

module.exports = requireRole;
