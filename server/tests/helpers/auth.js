/**
 * Creates a token for a fake user with the given role, so tests can call
 * protected routes without going through login.
 *   const faculty = tokenFor('Faculty');
 *   request(app).post('/api/...').set('Authorization', `Bearer ${faculty.token}`)
 */
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

function tokenFor(role, id = new mongoose.Types.ObjectId().toString()) {
  const token = jwt.sign({ sub: id, role }, process.env.JWT_SECRET, { expiresIn: 1800 });
  return { id, role, token };
}

module.exports = { tokenFor };
