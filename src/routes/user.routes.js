const express = require('express');

const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/user.controller');
const allowRoles = require('../middleware/allowRoles');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.use(verifyToken);

router.get('/', allowRoles('admin', 'analyst', 'employee'), getUsers);
router.get('/:id', allowRoles('admin', 'analyst', 'employee'), getUserById);
router.put('/:id', allowRoles('admin', 'employee'), updateUser);
router.delete('/:id', allowRoles('admin'), deleteUser);

module.exports = router;
