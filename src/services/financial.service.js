const {
  createFinancialRecord,
  findFinancialRecordById,
  listFinancialRecords,
  updateFinancialRecordById,
  deleteFinancialRecordById,
  getDashboardSummary,
  getDashboardTrends
} = require('../models/financial.model');

const READ_ALL_ROLES = ['admin', 'analyst'];
const WRITE_ALL_ROLES = ['admin'];
const OWNED_ROLES = ['employee'];

function createError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function canReadAll(role) {
  return READ_ALL_ROLES.includes(role);
}

function canWriteAll(role) {
  return WRITE_ALL_ROLES.includes(role);
}

function canCreateOwn(role) {
  return canWriteAll(role) || OWNED_ROLES.includes(role);
}

function getOwnershipScope(user) {
  if (canReadAll(user.role)) {
    return {};
  }

  return {
    restrictToUserId: user.id
  };
}

function normalizeFilters(query = {}, user = null) {
  const filters = {};

  if (query.type) {
    filters.type = query.type;
  }

  if (query.category) {
    filters.category = query.category;
  }

  if (query.startDate) {
    filters.startDate = query.startDate;
  }

  if (query.endDate) {
    filters.endDate = query.endDate;
  }

  if (query.user_id !== undefined && user && canReadAll(user.role)) {
    filters.user_id = Number(query.user_id);
  }

  if (query.page !== undefined) {
    filters.page = Number(query.page);
  }

  if (query.limit !== undefined) {
    filters.limit = Number(query.limit);
  }

  return filters;
}

function resolveCreatePayload(payload, user) {
  if (!canCreateOwn(user.role)) {
    throw createError(403, 'Access denied');
  }

  if (canWriteAll(user.role)) {
    return {
      ...payload,
      user_id: payload.user_id !== undefined ? Number(payload.user_id) : user.id
    };
  }

  return {
    ...payload,
    user_id: user.id
  };
}

async function getRecordForAccess(recordId, user) {
  const scope = getOwnershipScope(user);
  const record = await findFinancialRecordById(recordId, scope);

  if (!record) {
    throw createError(404, 'Financial record not found');
  }

  return record;
}

async function createRecord(payload, user) {
  const recordPayload = resolveCreatePayload(payload, user);

  return createFinancialRecord(recordPayload);
}

async function getRecords(query, user) {
  const filters = normalizeFilters(query, user);
  const scope = getOwnershipScope(user);

  const result = await listFinancialRecords(filters, scope);

  return {
    records: result.rows.map((item) => ({
      ...item,
      amount: Number(item.amount)
    })),
    pagination: result.pagination
  };
}

async function getRecordById(recordId, user) {
  return getRecordForAccess(recordId, user);
}

async function updateRecord(recordId, payload, user) {
  if (!canWriteAll(user.role)) {
    throw createError(403, 'Access denied');
  }

  await getRecordForAccess(recordId, user);

  const updatePayload = {
    ...payload
  };

  if (updatePayload.user_id !== undefined) {
    updatePayload.user_id = Number(updatePayload.user_id);
  }

  return updateFinancialRecordById(recordId, updatePayload);
}

async function deleteRecord(recordId, user) {
  if (!canWriteAll(user.role)) {
    throw createError(403, 'Access denied');
  }

  await getRecordForAccess(recordId, user);

  const deleted = await deleteFinancialRecordById(recordId);

  if (!deleted) {
    throw createError(404, 'Financial record not found');
  }
}

async function getSummary(query, user) {
  const filters = normalizeFilters(query, user);
  const scope = getOwnershipScope(user);
  const summary = await getDashboardSummary(filters, scope);

  return {
    totalIncome: Number(summary.totals.totalIncome || 0),
    totalExpenses: Number(summary.totals.totalExpenses || 0),
    netBalance: Number(summary.totals.totalIncome || 0) - Number(summary.totals.totalExpenses || 0),
    categoryBreakdown: summary.categoryBreakdown.map((item) => ({
      category: item.category,
      type: item.type,
      totalAmount: Number(item.totalAmount || 0)
    })),
    recentTransactions: summary.recentTransactions.map((item) => ({
      ...item,
      amount: Number(item.amount)
    }))
  };
}

async function getTrends(query, user) {
  const filters = normalizeFilters(query, user);
  const scope = getOwnershipScope(user);
  const trends = await getDashboardTrends(filters, scope);

  return {
    monthlyTotals: trends.monthlyTotals.map((item) => ({
      period: item.period,
      type: item.type,
      totalAmount: Number(item.totalAmount || 0)
    })),
    weeklyTotals: trends.weeklyTotals.map((item) => ({
      year: item.year,
      week: item.week,
      type: item.type,
      totalAmount: Number(item.totalAmount || 0)
    }))
  };
}

module.exports = {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
  getSummary,
  getTrends
};
