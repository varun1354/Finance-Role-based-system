const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const db = require('./config/db');
const apiRoutes = require('./routes');
const notFoundHandler = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT || 5000;

app.disable('etag');
app.use(
  cors({
    origin: [
      'http://localhost:4200',
       'https://finance-role-based-system.vercel.app',
      'https://finance-role-based-system-797itp4y9-varuns-projects-2fc1af1d.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', async (req, res, next) => {
  try {
    await db.query('SELECT 1');
    res.status(200).json({
      success: true,
      message: 'Server is running',
      database: 'connected'
    });
  } catch (error) {
    next(error);
  }
});

app.use('/api', apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
