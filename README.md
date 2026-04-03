# FRBAS

Finance Data Processing and Access Control Portal built with a Node.js + Express + MySQL backend and an Angular frontend.

## Overview

FRBAS provides:

- JWT-based authentication
- backend role-based access control
- user management
- employee profile management
- financial record management
- dashboard summaries and trends

The backend still supports `admin`, `analyst`, and `employee` roles.

The current frontend portal is intended for:

- `admin`
- `analyst`

Employee authentication still exists in the backend, but the employee dashboard has been removed from the frontend portal.

## Tech Stack

- Backend: Node.js, Express
- Database: MySQL
- Authentication: JWT, bcrypt
- Frontend: Angular

## Project Structure

```text
FRBAS/
  src/                 # backend source
    controllers/
    middleware/
    models/
    routes/
    services/
  frontend/            # Angular frontend
    src/
      app/
  package.json         # backend scripts
  frontend/package.json
```

## Roles And Access

### Admin

- can log in to the frontend portal
- full access to users, employees, records, and dashboard data

### Analyst

- can log in to the frontend portal
- read-only access to users, employees, financial records, and dashboard summaries
- cannot create or update employee profiles
- cannot update or delete users
- cannot create, update, or delete financial records

### Employee

- backend authentication and APIs still exist
- employee access is not available in the current frontend portal

## Installation

### Backend

From the project root:

```bash
npm install
```

Create a root `.env` file:

```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_NAME=finance_db
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
```

Start backend:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

### Frontend

From the `frontend` folder:

```bash
npm install
npm start
```

Frontend runs on:

```text
http://localhost:4200
```

## Important Frontend Note

The current Angular portal supports only admin and analyst usage.

If employee credentials are used in the frontend login screen, the UI shows:

```text
This portal is only for admin and analyst
```

This is a frontend restriction only. The backend employee role and APIs are still present.

**Portal Access**

**Admin Email:** `varun@admin.com`  
**Admin Password:** `123456`

**Analyst Email:** `akash@frbas.com`  
**Analyst Password:** `123456`

## Main API Base URL

```text
http://localhost:5000/api
```

## API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Users

- `GET /api/users`
- `GET /api/users/:id`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

### Employees

- `POST /api/employees`
- `GET /api/employees`
- `GET /api/employees/:userId`
- `PUT /api/employees/:id`

### Profile

- `GET /api/profile`

Returns joined user + employee profile data for the authenticated user.

### Financial Records

- `POST /api/records`
- `GET /api/records`
- `GET /api/records/:id`
- `PUT /api/records/:id`
- `DELETE /api/records/:id`

### Dashboard

- `GET /api/dashboard/summary`
- `GET /api/dashboard/trends`

## Example Profile Response

```json
{
  "success": true,
  "data": {
    "id": 6,
    "name": "Ananya Verma",
    "email": "ananya.verma@company.com",
    "role": "employee",
    "department": "Finance",
    "designation": "Executive",
    "emp_code": "EMP006",
    "status": "active"
  }
}
```

## Run Instructions

Open two terminals.

Backend:

```bash
npm run dev
```

Frontend:

```bash
cd frontend
npm start
```

## Notes

- the project is configured for local MySQL usage
- Docker is not used in the current setup
- the frontend currently has admin and analyst dashboards only
- the backend still exposes employee-related APIs

## Common Issues

### Angular workspace error

If you see:

```text
This command is not available when running the Angular CLI outside a workspace
```

run Angular commands from:

```text
frontend/
```

### Missing Angular packages

If Angular reports missing packages like `@angular/common`, reinstall frontend dependencies:

```bash
cd frontend
rm -rf node_modules
npm install
npm start
```

On Windows PowerShell:

```powershell
Remove-Item -Recurse -Force .\node_modules
npm.cmd install
npm.cmd start
```
