const express = require('express');
const authRoutes = require('./auth.routes');
const dashboardRoutes = require('./dashboard.routes');
const employeeRoutes = require('./employee.routes');
const exampleRoutes = require('./example.routes');
const financialRoutes = require('./financial.routes');
const protectedRoutes = require('./protected.routes');
const userRoutes = require('./user.routes');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'RBAS API is ready'
  });
});

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/employees', employeeRoutes);
router.use('/examples', exampleRoutes);
router.use('/records', financialRoutes);
router.use('/protected', protectedRoutes);
router.use('/users', userRoutes);

module.exports = router;
