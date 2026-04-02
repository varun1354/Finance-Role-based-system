const express = require('express');

const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.get('/profile', verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Protected route accessed successfully',
    data: req.user
  });
});

module.exports = router;
