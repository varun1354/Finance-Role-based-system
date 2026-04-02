const db = require('../config/db');

function buildOwnershipClause(scope = {}) {
  if (scope.restrictToUserId) {
    return {
      clause: 'fr.user_id = ?',
      params: [scope.restrictToUserId]
    };
  }

  return {
    clause: '1 = 1',
    params: []
  };
}

function buildFilterClauses(filters = {}, scope = {}) {
  const clauses = [];
  const params = [];
  const ownership = buildOwnershipClause(scope);

  clauses.push(ownership.clause);
  params.push(...ownership.params);

  if (filters.user_id !== undefined) {
    clauses.push('fr.user_id = ?');
    params.push(filters.user_id);
  }

  if (filters.type) {
    clauses.push('fr.type = ?');
    params.push(filters.type);
  }

  if (filters.category) {
    clauses.push('fr.category = ?');
    params.push(filters.category);
  }

  if (filters.startDate) {
    clauses.push('fr.date >= ?');
    params.push(filters.startDate);
  }

  if (filters.endDate) {
    clauses.push('fr.date <= ?');
    params.push(filters.endDate);
  }

  return {
    whereClause: clauses.length > 0 ? clauses.join(' AND ') : '1 = 1',
    params
  };
}

async function createFinancialRecord(payload) {
  const query = `
    INSERT INTO financial_records (user_id, amount, type, category, date, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.execute(query, [
    payload.user_id,
    payload.amount,
    payload.type,
    payload.category,
    payload.date,
    payload.notes || null
  ]);

  return findFinancialRecordById(result.insertId);
}

async function findFinancialRecordById(id, scope = {}) {
  const ownership = buildOwnershipClause(scope);
  const query = `
    SELECT
      fr.id,
      fr.user_id,
      u.name AS user_name,
      u.email AS user_email,
      u.role AS user_role,
      fr.amount,
      fr.type,
      fr.category,
      fr.date,
      fr.notes,
      fr.created_at,
      fr.updated_at
    FROM financial_records fr
    INNER JOIN users u ON u.id = fr.user_id
    WHERE fr.id = ? AND ${ownership.clause}
    LIMIT 1
  `;

  const [rows] = await db.execute(query, [id, ...ownership.params]);

  return rows[0] || null;
}

async function listFinancialRecords(filters = {}, scope = {}) {
  const { whereClause, params } = buildFilterClauses(filters, scope);
  const page = Number.isInteger(filters.page) && filters.page > 0 ? filters.page : 1;
  const limit = Number.isInteger(filters.limit) && filters.limit > 0 ? filters.limit : 10;
  const offset = (page - 1) * limit;
  const query = `
    SELECT
      fr.id,
      fr.user_id,
      u.name AS user_name,
      u.email AS user_email,
      u.role AS user_role,
      fr.amount,
      fr.type,
      fr.category,
      fr.date,
      fr.notes,
      fr.created_at,
      fr.updated_at
    FROM financial_records fr
    INNER JOIN users u ON u.id = fr.user_id
    WHERE ${whereClause}
    ORDER BY fr.date DESC, fr.id DESC
    LIMIT ? OFFSET ?
  `;

  const [rows] = await db.execute(query, [...params, limit, offset]);
  const [countRows] = await db.execute(
    `
      SELECT COUNT(*) AS total
      FROM financial_records fr
      WHERE ${whereClause}
    `,
    params
  );

  return {
    rows,
    pagination: {
      page,
      limit,
      total: Number(countRows[0].total || 0),
      totalPages: Math.ceil(Number(countRows[0].total || 0) / limit) || 1
    }
  };
}

async function updateFinancialRecordById(id, payload) {
  const fields = [];
  const values = [];

  ['user_id', 'amount', 'type', 'category', 'date', 'notes'].forEach((field) => {
    if (payload[field] !== undefined) {
      fields.push(`${field} = ?`);
      values.push(payload[field]);
    }
  });

  if (fields.length === 0) {
    return findFinancialRecordById(id);
  }

  const query = `
    UPDATE financial_records
    SET ${fields.join(', ')}
    WHERE id = ?
  `;

  values.push(id);

  await db.execute(query, values);

  return findFinancialRecordById(id);
}

async function deleteFinancialRecordById(id) {
  const query = `
    DELETE FROM financial_records
    WHERE id = ?
  `;

  const [result] = await db.execute(query, [id]);

  return result.affectedRows > 0;
}

async function getDashboardSummary(filters = {}, scope = {}) {
  const { whereClause, params } = buildFilterClauses(filters, scope);

  const [totalsRows] = await db.execute(
    `
      SELECT
        COALESCE(SUM(CASE WHEN fr.type = 'income' THEN fr.amount ELSE 0 END), 0) AS totalIncome,
        COALESCE(SUM(CASE WHEN fr.type = 'expense' THEN fr.amount ELSE 0 END), 0) AS totalExpenses
      FROM financial_records fr
      WHERE ${whereClause}
    `,
    params
  );

  const [categoryRows] = await db.execute(
    `
      SELECT
        fr.category,
        fr.type,
        COALESCE(SUM(fr.amount), 0) AS totalAmount
      FROM financial_records fr
      WHERE ${whereClause}
      GROUP BY fr.category, fr.type
      ORDER BY totalAmount DESC, fr.category ASC
    `,
    params
  );

  const [recentRows] = await db.execute(
    `
      SELECT
        fr.id,
        fr.user_id,
        u.name AS user_name,
        u.email AS user_email,
        u.role AS user_role,
        fr.amount,
        fr.type,
        fr.category,
        fr.date,
        fr.notes,
        fr.created_at,
        fr.updated_at
      FROM financial_records fr
      INNER JOIN users u ON u.id = fr.user_id
      WHERE ${whereClause}
      ORDER BY fr.date DESC, fr.id DESC
      LIMIT 5
    `,
    params
  );

  return {
    totals: totalsRows[0],
    categoryBreakdown: categoryRows,
    recentTransactions: recentRows
  };
}

async function getDashboardTrends(filters = {}, scope = {}) {
  const { whereClause, params } = buildFilterClauses(filters, scope);

  const [monthlyRows] = await db.execute(
    `
      SELECT
        DATE_FORMAT(fr.date, '%Y-%m') AS period,
        fr.type,
        COALESCE(SUM(fr.amount), 0) AS totalAmount
      FROM financial_records fr
      WHERE ${whereClause}
      GROUP BY DATE_FORMAT(fr.date, '%Y-%m'), fr.type
      ORDER BY period ASC, fr.type ASC
    `,
    params
  );

  const [weeklyRows] = await db.execute(
    `
      SELECT
        YEAR(fr.date) AS year,
        WEEK(fr.date, 1) AS week,
        fr.type,
        COALESCE(SUM(fr.amount), 0) AS totalAmount
      FROM financial_records fr
      WHERE ${whereClause}
      GROUP BY YEAR(fr.date), WEEK(fr.date, 1), fr.type
      ORDER BY year ASC, week ASC, fr.type ASC
    `,
    params
  );

  return {
    monthlyTotals: monthlyRows,
    weeklyTotals: weeklyRows
  };
}

module.exports = {
  createFinancialRecord,
  findFinancialRecordById,
  listFinancialRecords,
  updateFinancialRecordById,
  deleteFinancialRecordById,
  getDashboardSummary,
  getDashboardTrends
};
