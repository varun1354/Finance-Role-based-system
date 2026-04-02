const express = require('express');

const { getDashboardSummary, getDashboardTrends } = require('../controllers/financial.controller');
const allowRoles = require('../middleware/allowRoles');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.use(verifyToken);

router.get('/summary', allowRoles('admin', 'analyst', 'employee'), getDashboardSummary);
router.get('/trends', allowRoles('admin', 'analyst', 'employee'), getDashboardTrends);

module.exports = router;
