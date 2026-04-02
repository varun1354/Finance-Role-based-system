const db = require('../config/db');

async function createUser({ name, email, password, role, phone, status = 'active' }) {
  const query = `
    INSERT INTO users (name, email, password, role, phone, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.execute(query, [name, email, password, role, phone || null, status]);

  return findUserById(result.insertId);
}

async function findUserByEmail(email) {
  const query = `
    SELECT id, name, email, password, role, phone, status, created_at, updated_at
    FROM users
    WHERE email = ?
    LIMIT 1
  `;

  const [rows] = await db.execute(query, [email]);

  return rows[0] || null;
}

async function findUserById(id) {
  const query = `
    SELECT id, name, email, role, phone, status, created_at, updated_at
    FROM users
    WHERE id = ?
    LIMIT 1
  `;

  const [rows] = await db.execute(query, [id]);

  return rows[0] || null;
}

async function getAllUsers() {
  const query = `
    SELECT id, name, email, role, phone, status, created_at, updated_at
    FROM users
    ORDER BY id ASC
  `;

  const [rows] = await db.execute(query);

  return rows;
}

async function getUsersByRole(role) {
  const query = `
    SELECT id, name, email, role, phone, status, created_at, updated_at
    FROM users
    WHERE role = ?
    ORDER BY id ASC
  `;

  const [rows] = await db.execute(query, [role]);

  return rows;
}

async function updateUserById(id, updates) {
  const fields = [];
  const values = [];

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  });

  if (fields.length === 0) {
    return findUserById(id);
  }

  const query = `
    UPDATE users
    SET ${fields.join(', ')}
    WHERE id = ?
  `;

  values.push(id);

  await db.execute(query, values);

  return findUserById(id);
}

async function deleteUserById(id) {
  const query = `
    DELETE FROM users
    WHERE id = ?
  `;

  const [result] = await db.execute(query, [id]);

  return result.affectedRows > 0;
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  getAllUsers,
  getUsersByRole,
  updateUserById,
  deleteUserById
};
