const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const apiRoutes = require('./routes');
const { errorHandler, notFoundRoute } = require('./middleware/errorHandler');

const app = express();

app.use(helmet()); // security headers
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '100kb' }));
app.use(mongoSanitize()); // NoSQL-injection protection (SAD 3.9)

if (process.env.NODE_ENV !== 'test') {
  app.use(
    '/api',
    rateLimit({
      windowMs: 60 * 1000,
      limit: 300,
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req, res) =>
        res.status(429).json({ error: { code: 'RATE_LIMITED', message: 'Too many requests, try again later' } }),
    })
  );
}

app.use('/api', apiRoutes); // all endpoints live under /api (SAD 4.3)

app.use(notFoundRoute);
app.use(errorHandler);

module.exports = app;
