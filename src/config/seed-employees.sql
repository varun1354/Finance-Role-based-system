INSERT INTO users (name, email, password, role)
VALUES
  ('Employee 01', 'employee01@rbas.com', '$2b$10$mSC0ZSM0XLfmLJLh8SQeAOJej7UdHawoYdhu5tqPC2ui41fcveSXC', 'employee'),
  ('Employee 02', 'employee02@rbas.com', '$2b$10$wcQf8n0c4O9B7Q1tHuhiiODQNCFeDjw636T4sHFoEfZ43iaGgeDj6', 'employee'),
  ('Employee 03', 'employee03@rbas.com', '$2b$10$DmpZ2H5P5Oc7RjQfHg8y8ebstHLu51CFA.PmgxpVaxMG64bkGSJJu', 'employee'),
  ('Employee 04', 'employee04@rbas.com', '$2b$10$54KqjgPSfjr3FSM5lM4zXeV/Twdlst9WkDLbrTHyQ0LAViYBSbcNq', 'employee'),
  ('Employee 05', 'employee05@rbas.com', '$2b$10$zpQOsC7uAFgAk629uD6QeO1VXPu8VBYNGsOIs.cVBsr/rKtIUuK7K', 'employee'),
  ('Employee 06', 'employee06@rbas.com', '$2b$10$tgC..Sm5tkUArJlXcH0mguWsGB/7KPZROCxlWJlDV4EnD3tmm9QLq', 'employee'),
  ('Employee 07', 'employee07@rbas.com', '$2b$10$QGXUDaSslA//Aq0TAg5z8OZjJdGHGAqQLQ2n34KL0hlBrohACgrO2', 'employee'),
  ('Employee 08', 'employee08@rbas.com', '$2b$10$rDapOHR4hVgftNs92oaFiuefD5aaJUgZ.duafU58S.XlaJyztbi.K', 'employee'),
  ('Employee 09', 'employee09@rbas.com', '$2b$10$qjBePdvJA5g0PACD7De0KukXbKuKqXcBQJqF5OHNLtuHuqWK04xFu', 'employee'),
  ('Employee 10', 'employee10@rbas.com', '$2b$10$ogMnPeYeILhLbVNHaSmwJ.6PJZCvqkl.sL.7n.zKCuEKKrDfEZsEm', 'employee'),
  ('Employee 11', 'employee11@rbas.com', '$2b$10$ssxzylreR1VMpwCFGX53pu2FElIi3iiN8c3laKrQq6ABcTfdcZA7W', 'employee'),
  ('Employee 12', 'employee12@rbas.com', '$2b$10$LAu2dz6PVitnZP8VKodL1.qZ9fZitdbAp61SyW0Z6XQA5xnSQIhRC', 'employee'),
  ('Employee 13', 'employee13@rbas.com', '$2b$10$P/8DM4t50FPu.qFRRF0fYO5xWdXo6T36EU5jd/q/w64BPIK.AzJ7m', 'employee'),
  ('Employee 14', 'employee14@rbas.com', '$2b$10$H/zVuVp3ZJruSYRoFY7wMOtknN4IP2V0R7U4FMb9y4R3YWeu.9IDO', 'employee'),
  ('Employee 15', 'employee15@rbas.com', '$2b$10$hnL3GoaFzf6q/ERYyn.G8.mI6rdFoLCzpnN7yKKNp/40ZY4OaCK7.', 'employee'),
  ('Employee 16', 'employee16@rbas.com', '$2b$10$aksMfwiOEj4XX3aPtupwb.RHH1iB5CuAvqpFhhdM0tCgOoeFNzPyq', 'employee'),
  ('Employee 17', 'employee17@rbas.com', '$2b$10$PdrBKoRr0on1wEe5B5bhd.KfsdT0nQ21ylMYcZGfsCtsqQL9fQvoq', 'employee'),
  ('Employee 18', 'employee18@rbas.com', '$2b$10$h3ytM8cTWgn6H2CMfx8OSOC6UVS0sQgmmPni0ZLZ/8zZG35ta9wuy', 'employee'),
  ('Employee 19', 'employee19@rbas.com', '$2b$10$hJbWV9E6gXpQKPBuReLiOOxgREzh3ntMwLvERH9FWy7JXfbCvezBO', 'employee'),
  ('Employee 20', 'employee20@rbas.com', '$2b$10$/IwjxehgvlSAxXbXCKu4uuiK7NZQpwLAmxDtVZ5GsaKWXVDJdHMX6', 'employee')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  password = VALUES(password),
  role = VALUES(role);

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
SELECT u.id, seed.employee_code, seed.department, seed.designation, seed.phone, seed.address, seed.salary, seed.hire_date, seed.status, seed.manager_name
FROM users u
JOIN (
  SELECT 'employee01@rbas.com' AS email, 'EMP001' AS employee_code, 'Engineering' AS department, 'Software Engineer' AS designation, '9876500001' AS phone, 'Bangalore, India' AS address, 55000.00 AS salary, '2023-01-10' AS hire_date, 'active' AS status, 'Human Resources' AS manager_name
  UNION ALL SELECT 'employee02@rbas.com', 'EMP002', 'Engineering', 'Backend Developer', '9876500002', 'Hyderabad, India', 58000.00, '2023-02-14', 'active', 'Human Resources'
  UNION ALL SELECT 'employee03@rbas.com', 'EMP003', 'Engineering', 'Frontend Developer', '9876500003', 'Pune, India', 56000.00, '2023-03-20', 'active', 'Human Resources'
  UNION ALL SELECT 'employee04@rbas.com', 'EMP004', 'Engineering', 'QA Engineer', '9876500004', 'Chennai, India', 50000.00, '2023-04-11', 'active', 'Human Resources'
  UNION ALL SELECT 'employee05@rbas.com', 'EMP005', 'Engineering', 'DevOps Engineer', '9876500005', 'Noida, India', 62000.00, '2023-05-09', 'active', 'Human Resources'
  UNION ALL SELECT 'employee06@rbas.com', 'EMP006', 'Human Resources', 'HR Executive', '9876500006', 'Delhi, India', 47000.00, '2023-06-01', 'active', 'Human Resources'
  UNION ALL SELECT 'employee07@rbas.com', 'EMP007', 'Human Resources', 'Talent Acquisition Specialist', '9876500007', 'Mumbai, India', 49000.00, '2023-06-18', 'on_leave', 'Human Resources'
  UNION ALL SELECT 'employee08@rbas.com', 'EMP008', 'Finance', 'Accountant', '9876500008', 'Kolkata, India', 53000.00, '2023-07-07', 'active', 'System Admin'
  UNION ALL SELECT 'employee09@rbas.com', 'EMP009', 'Finance', 'Financial Analyst', '9876500009', 'Ahmedabad, India', 61000.00, '2023-07-21', 'active', 'System Admin'
  UNION ALL SELECT 'employee10@rbas.com', 'EMP010', 'Sales', 'Sales Executive', '9876500010', 'Jaipur, India', 45000.00, '2023-08-03', 'inactive', 'System Admin'
  UNION ALL SELECT 'employee11@rbas.com', 'EMP011', 'Sales', 'Business Development Executive', '9876500011', 'Lucknow, India', 46000.00, '2023-08-17', 'active', 'System Admin'
  UNION ALL SELECT 'employee12@rbas.com', 'EMP012', 'Support', 'Support Engineer', '9876500012', 'Indore, India', 42000.00, '2023-09-05', 'active', 'System Admin'
  UNION ALL SELECT 'employee13@rbas.com', 'EMP013', 'Support', 'Customer Success Associate', '9876500013', 'Bhopal, India', 41000.00, '2023-09-19', 'active', 'System Admin'
  UNION ALL SELECT 'employee14@rbas.com', 'EMP014', 'Operations', 'Operations Executive', '9876500014', 'Surat, India', 44000.00, '2023-10-02', 'active', 'System Admin'
  UNION ALL SELECT 'employee15@rbas.com', 'EMP015', 'Operations', 'Process Analyst', '9876500015', 'Nagpur, India', 47000.00, '2023-10-16', 'active', 'System Admin'
  UNION ALL SELECT 'employee16@rbas.com', 'EMP016', 'Marketing', 'Marketing Executive', '9876500016', 'Patna, India', 48000.00, '2023-11-06', 'active', 'System Admin'
  UNION ALL SELECT 'employee17@rbas.com', 'EMP017', 'Marketing', 'SEO Specialist', '9876500017', 'Coimbatore, India', 50000.00, '2023-11-21', 'active', 'System Admin'
  UNION ALL SELECT 'employee18@rbas.com', 'EMP018', 'Product', 'Product Analyst', '9876500018', 'Kochi, India', 64000.00, '2023-12-04', 'active', 'System Admin'
  UNION ALL SELECT 'employee19@rbas.com', 'EMP019', 'Product', 'Product Coordinator', '9876500019', 'Visakhapatnam, India', 52000.00, '2023-12-18', 'active', 'System Admin'
  UNION ALL SELECT 'employee20@rbas.com', 'EMP020', 'Engineering', 'Data Engineer', '9876500020', 'Mysore, India', 67000.00, '2024-01-08', 'active', 'System Admin'
) AS seed
  ON u.email = seed.email
ON DUPLICATE KEY UPDATE
  department = VALUES(department),
  designation = VALUES(designation),
  phone = VALUES(phone),
  address = VALUES(address),
  salary = VALUES(salary),
  hire_date = VALUES(hire_date),
  status = VALUES(status),
  manager_name = VALUES(manager_name);
