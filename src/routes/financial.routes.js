const express = require('express');

const {
  createFinancialRecord,
  getFinancialRecords,
  getFinancialRecord,
  updateFinancialRecord,
  deleteFinancialRecord
} = require('../controllers/financial.controller');
const allowRoles = require('../middleware/allowRoles');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.use(verifyToken);

router.post('/', allowRoles('admin', 'employee'), createFinancialRecord);
router.get('/', allowRoles('admin', 'analyst', 'employee'), getFinancialRecords);
router.get('/:id', allowRoles('admin', 'analyst', 'employee'), getFinancialRecord);
router.put('/:id', allowRoles('admin'), updateFinancialRecord);
router.delete('/:id', allowRoles('admin'), deleteFinancialRecord);

module.exports = router;
