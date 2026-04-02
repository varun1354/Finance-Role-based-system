const db = require('../config/db');

async function getAllEmployees() {
  const query = `
    SELECT
      e.id,
      e.user_id,
      u.name,
      u.email,
      u.role,
      e.employee_code,
      e.department,
      e.designation,
      e.phone,
      e.address,
      e.salary,
      e.hire_date,
      e.status,
      e.manager_name,
      e.created_at,
      e.updated_at
    FROM employees e
    INNER JOIN users u ON u.id = e.user_id
    ORDER BY e.id ASC
  `;

  const [rows] = await db.execute(query);

  return rows;
}

async function findEmployeeByUserId(userId) {
  const query = `
    SELECT
      e.id,
      e.user_id,
      u.name,
      u.email,
      u.role,
      e.employee_code,
      e.department,
      e.designation,
      e.phone,
      e.address,
      e.salary,
      e.hire_date,
      e.status,
      e.manager_name,
      e.created_at,
      e.updated_at
    FROM employees e
    INNER JOIN users u ON u.id = e.user_id
    WHERE e.user_id = ?
    LIMIT 1
  `;

  const [rows] = await db.execute(query, [userId]);

  return rows[0] || null;
}

async function findEmployeeById(id) {
  const query = `
    SELECT
      e.id,
      e.user_id,
      u.name,
      u.email,
      u.role,
      e.employee_code,
      e.department,
      e.designation,
      e.phone,
      e.address,
      e.salary,
      e.hire_date,
      e.status,
      e.manager_name,
      e.created_at,
      e.updated_at
    FROM employees e
    INNER JOIN users u ON u.id = e.user_id
    WHERE e.id = ?
    LIMIT 1
  `;

  const [rows] = await db.execute(query, [id]);

  return rows[0] || null;
}

async function updateEmployeeStatusByUserId(userId, status) {
  await db.execute(
    `
      UPDATE employees
      SET status = ?
      WHERE user_id = ?
    `,
    [status, userId]
  );
}

module.exports = {
  getAllEmployees,
  findEmployeeByUserId,
  findEmployeeById,
  updateEmployeeStatusByUserId
};
