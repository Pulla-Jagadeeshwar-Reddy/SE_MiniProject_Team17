const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

/**
 * Checks the "Authorization: Bearer <token>" header and sets
 *   req.user = { id, role }   // role is 'Student' | 'Faculty' | 'Admin'
 *
 * TEMPORARY: verifies the JWT only. Issue #5 (login & session management)
 * replaces the body of this function with the full check from SAD ADR-3
 * (token must also have a valid server-side session record; 30-minute
 * inactivity; invalidated on logout). Keep the same name and the same
 * req.user shape so no other module has to change.
 */
function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return next(AppError.notAuthenticated());
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, role: payload.role };
    return next();
  } catch (err) {
    return next(AppError.notAuthenticated());
  }
}

module.exports = authenticate;
