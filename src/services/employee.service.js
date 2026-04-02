const bcrypt = require('bcrypt');

const db = require('../config/db');

const SALT_ROUNDS = 10;

async function createEmployeeWithUser(payload) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const hashedPassword = await bcrypt.hash(payload.password, SALT_ROUNDS);

    const [userResult] = await connection.execute(
      `
        INSERT INTO users (name, email, password, role)
        VALUES (?, ?, ?, 'employee')
      `,
      [payload.name, payload.email, hashedPassword]
    );

    const [employeeResult] = await connection.execute(
      `
        INSERT INTO employees (
          user_id,
          employee_code,
          department,
          designation,
          phone,
          address,
          salary,
          hire_date,
          status,
          manager_name
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        userResult.insertId,
        payload.employee_code,
        payload.department,
        payload.designation,
        payload.phone,
        payload.address,
        payload.salary,
        payload.hire_date,
        payload.status || 'active',
        payload.manager_name || null
      ]
    );

    await connection.commit();

    const [rows] = await db.execute(
      `
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
      `,
      [employeeResult.insertId]
    );

    const employee = rows[0] || null;

    return employee;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function updateEmployeeDetails(employeeId, payload) {
  const fields = [];
  const values = [];

  ['department', 'designation', 'phone', 'address', 'salary', 'hire_date', 'status', 'manager_name'].forEach((field) => {
    if (payload[field] !== undefined) {
      fields.push(`${field} = ?`);
      values.push(payload[field]);
    }
  });

  if (fields.length > 0) {
    values.push(employeeId);

    await db.execute(
      `
        UPDATE employees
        SET ${fields.join(', ')}
        WHERE id = ?
      `,
      values
    );
  }

  const [rows] = await db.execute(
    `
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
    `,
    [employeeId]
  );

  const employee = rows[0] || null;

  return employee;
}

module.exports = {
  createEmployeeWithUser,
  updateEmployeeDetails
};
