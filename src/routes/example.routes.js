const express = require('express');

const verifyToken = require('../middleware/verifyToken');
const allowRoles = require('../middleware/allowRoles');

const router = express.Router();

router.get('/admin-only', verifyToken, allowRoles('admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome admin',
    data: req.user
  });
});

router.get('/analyst-only', verifyToken, allowRoles('analyst'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome analyst',
    data: req.user
  });
});

router.get('/employees/:id', verifyToken, allowRoles('admin', 'employee'), (req, res) => {
  const requestedUserId = Number(req.params.id);

  if (req.user.role === 'employee' && req.user.id !== requestedUserId) {
    return res.status(403).json({
      success: false,
      message: 'Employees can only access their own data'
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Employee self-access granted',
    data: {
      requestedUserId,
      currentUser: req.user
    }
  });
});

module.exports = router;
