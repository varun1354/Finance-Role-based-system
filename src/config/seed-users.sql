INSERT INTO users (name, email, password, role, status)
VALUES
  ('System Admin', 'admin@rbas.com', '$2b$10$.0lsJNytAQm.erLdWgdMVuqhErxwND8aj6a4x9tVVzzWR2whOKQtu', 'admin', 'active'),
  ('Business Analyst', 'analyst@rbas.com', '$2b$10$7T.Zqr9DNYM.ZkAhGpeGs.oryhRDVQG1GC4PK4c1kc4L1jcbjEmoO', 'analyst', 'active'),
  ('Employee One', 'employee@rbas.com', '$2b$10$MD14GMK0u7PgTS938H04OOSOfCkL2yNa5ziKhkeIKZInO0WzOwkYe', 'employee', 'active')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  password = VALUES(password),
  role = VALUES(role),
  status = VALUES(status);
