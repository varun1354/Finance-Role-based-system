const {
  getAllEmployees,
  findEmployeeByUserId,
  findEmployeeById
} = require('../models/employeeModel');
const { createEmployeeWithUser, updateEmployeeDetails } = require('../services/employee.service');

async function getEmployees(req, res, next) {
  try {
    if (req.user.role === 'employee') {
      const employee = await findEmployeeByUserId(req.user.id);

      return res.status(200).json({
        success: true,
        data: employee ? [employee] : []
      });
    }

    const employees = await getAllEmployees();

    return res.status(200).json({
      success: true,
      data: employees
    });
  } catch (error) {
    return next(error);
  }
}
 
async function createEmployee(req, res, next) {
  try {
    const requiredFields = [
      'name',
      'email',
      'password',
      'employee_code',
      'department',
      'designation',
      'phone',
      'address',
      'salary',
      'hire_date'
    ];

    const missingField = requiredFields.find((field) => req.body[field] === undefined || req.body[field] === '');

    if (missingField) {
      return res.status(400).json({
        success: false,
        message: `${missingField} is required`
      });
    }

    const employee = await createEmployeeWithUser(req.body);

    return res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee
    });
  } catch (error) {
    return next(error);
  }
}

async function getEmployeeByUserId(req, res, next) {
  try {
    const targetUserId = Number(req.params.userId);
    const isAdmin = req.user.role === 'admin';
    const isAnalyst = req.user.role === 'analyst';
    const isSelf = req.user.id === targetUserId;

    if (!isAdmin && !isAnalyst && !isSelf) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const employee = await findEmployeeByUserId(targetUserId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee details not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    return next(error);
  }
}

async function updateEmployee(req, res, next) {
  try {
    const employeeId = Number(req.params.id);
    const employee = await findEmployeeById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    if (req.user.role === 'employee' && req.user.id !== employee.user_id) {
      return res.status(403).json({
        success: false,
        message: 'Employees can update their own record only'
      });
    }

    const updatedEmployee = await updateEmployeeDetails(employeeId, req.body);

    return res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: updatedEmployee
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeByUserId,
  updateEmployee
};
