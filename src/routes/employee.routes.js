const express = require('express');

const {
  createEmployee,
  getEmployees,
  getEmployeeByUserId,
  updateEmployee
} = require('../controllers/employee.controller');
const allowRoles = require('../middleware/allowRoles');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.use(verifyToken);

router.post('/', allowRoles('admin'), createEmployee);
router.get('/', allowRoles('admin', 'analyst', 'employee'), getEmployees);
router.put('/:id', allowRoles('admin', 'employee'), updateEmployee);
router.get('/:userId', allowRoles('admin', 'analyst', 'employee'), getEmployeeByUserId);

module.exports = router;
