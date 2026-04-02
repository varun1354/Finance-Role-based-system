const {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
  getSummary,
  getTrends
} = require('../services/financial.service');

const VALID_TYPES = ['income', 'expense'];

function validateRecordPayload(payload, isPartial = false) {
  const { amount, type, category, date } = payload;

  if (!isPartial || amount !== undefined) {
    if (amount === undefined || Number(amount) <= 0 || Number.isNaN(Number(amount))) {
      return 'amount must be greater than 0';
    }
  }

  if (!isPartial || type !== undefined) {
    if (!VALID_TYPES.includes(type)) {
      return "type must be either 'income' or 'expense'";
    }
  }

  if (!isPartial || category !== undefined) {
    if (!category || !String(category).trim()) {
      return 'category is required';
    }
  }

  if (!isPartial || date !== undefined) {
    if (!date || Number.isNaN(Date.parse(date))) {
      return 'date is required';
    }
  }

  if (payload.user_id !== undefined && Number.isNaN(Number(payload.user_id))) {
    return 'user_id must be a valid number';
  }

  return null;
}

function validateFilters(query) {
  if (query.type && !VALID_TYPES.includes(query.type)) {
    return "type must be either 'income' or 'expense'";
  }

  if (query.startDate && Number.isNaN(Date.parse(query.startDate))) {
    return 'startDate must be a valid date';
  }

  if (query.endDate && Number.isNaN(Date.parse(query.endDate))) {
    return 'endDate must be a valid date';
  }

  if (query.user_id !== undefined && Number.isNaN(Number(query.user_id))) {
    return 'user_id must be a valid number';
  }

  if (query.page !== undefined && (!Number.isInteger(Number(query.page)) || Number(query.page) <= 0)) {
    return 'page must be a positive integer';
  }

  if (query.limit !== undefined && (!Number.isInteger(Number(query.limit)) || Number(query.limit) <= 0)) {
    return 'limit must be a positive integer';
  }

  if (
    query.startDate &&
    query.endDate &&
    !Number.isNaN(Date.parse(query.startDate)) &&
    !Number.isNaN(Date.parse(query.endDate)) &&
    new Date(query.startDate) > new Date(query.endDate)
  ) {
    return 'startDate cannot be greater than endDate';
  }

  return null;
}

async function createFinancialRecord(req, res, next) {
  try {
    const validationMessage = validateRecordPayload(req.body);

    if (validationMessage) {
      return res.status(400).json({
        success: false,
        message: validationMessage
      });
    }

    const record = await createRecord(
      {
        ...req.body,
        amount: Number(req.body.amount)
      },
      req.user
    );

    return res.status(201).json({
      success: true,
      message: 'Financial record created successfully',
      data: record
    });
  } catch (error) {
    return next(error);
  }
}

async function getFinancialRecords(req, res, next) {
  try {
    const validationMessage = validateFilters(req.query);

    if (validationMessage) {
      return res.status(400).json({
        success: false,
        message: validationMessage
      });
    }

    const result = await getRecords(req.query, req.user);

    return res.status(200).json({
      success: true,
      data: result.records,
      pagination: result.pagination
    });
  } catch (error) {
    return next(error);
  }
}

async function getFinancialRecord(req, res, next) {
  try {
    const recordId = Number(req.params.id);

    if (Number.isNaN(recordId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid record id'
      });
    }

    const record = await getRecordById(recordId, req.user);

    return res.status(200).json({
      success: true,
      data: record
    });
  } catch (error) {
    return next(error);
  }
}

async function updateFinancialRecord(req, res, next) {
  try {
    const recordId = Number(req.params.id);

    if (Number.isNaN(recordId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid record id'
      });
    }

    const validationMessage = validateRecordPayload(req.body, true);

    if (validationMessage) {
      return res.status(400).json({
        success: false,
        message: validationMessage
      });
    }

    const record = await updateRecord(
      recordId,
      {
        ...req.body,
        amount: req.body.amount !== undefined ? Number(req.body.amount) : undefined
      },
      req.user
    );

    return res.status(200).json({
      success: true,
      message: 'Financial record updated successfully',
      data: record
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteFinancialRecord(req, res, next) {
  try {
    const recordId = Number(req.params.id);

    if (Number.isNaN(recordId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid record id'
      });
    }

    await deleteRecord(recordId, req.user);

    return res.status(200).json({
      success: true,
      message: 'Financial record deleted successfully'
    });
  } catch (error) {
    return next(error);
  }
}

async function getDashboardSummary(req, res, next) {
  try {
    const validationMessage = validateFilters(req.query);

    if (validationMessage) {
      return res.status(400).json({
        success: false,
        message: validationMessage
      });
    }

    const summary = await getSummary(req.query, req.user);

    return res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    return next(error);
  }
}

async function getDashboardTrends(req, res, next) {
  try {
    const validationMessage = validateFilters(req.query);

    if (validationMessage) {
      return res.status(400).json({
        success: false,
        message: validationMessage
      });
    }

    const trends = await getTrends(req.query, req.user);

    return res.status(200).json({
      success: true,
      data: trends
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createFinancialRecord,
  getFinancialRecords,
  getFinancialRecord,
  updateFinancialRecord,
  deleteFinancialRecord,
  getDashboardSummary,
  getDashboardTrends
};
