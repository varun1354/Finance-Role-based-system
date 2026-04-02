const {
  findUserById,
  findUserByEmail,
  getAllUsers,
  getUsersByRole,
  updateUserById,
  deleteUserById
} = require('../models/userModel');
const { updateEmployeeStatusByUserId } = require('../models/employeeModel');

const VALID_ROLES = ['admin', 'analyst', 'employee'];
const VALID_STATUSES = ['active', 'inactive'];

function isSelf(req) {
  return req.user.id === Number(req.params.id);
}

async function getUsers(req, res, next) {
  try {
    let users;

    if (req.user.role === 'admin') {
      users = await getAllUsers();
    } else if (req.user.role === 'analyst') {
      users = await getUsersByRole('employee');
    } else {
      const currentUser = await findUserById(req.user.id);
      users = currentUser ? [currentUser] : [];
    }

    return res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    return next(error);
  }
}

async function getUserById(req, res, next) {
  try {
    const targetUserId = Number(req.params.id);
    const isAdmin = req.user.role === 'admin';
    const isAnalyst = req.user.role === 'analyst';

    const user = await findUserById(targetUserId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (isAdmin) {
      return res.status(200).json({
        success: true,
        data: user
      });
    }

    if (isAnalyst) {
      if (user.role !== 'employee') {
        return res.status(403).json({
          success: false,
          message: 'Analyst can access employees only'
        });
      }

      return res.status(200).json({
        success: true,
        data: user
      });
    }

    if (!isSelf(req)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    return next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const targetUserId = Number(req.params.id);
    const targetUser = await findUserById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isAdmin = req.user.role === 'admin';
    const isCurrentUser = isSelf(req);

    if (!isAdmin && !isCurrentUser) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { name, email, role, phone, status } = req.body;
    const updates = {};

    if (name !== undefined) {
      updates.name = name;
    }

    if (email !== undefined) {
      const existingUser = await findUserByEmail(email);

      if (existingUser && existingUser.id !== targetUserId) {
        return res.status(409).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      updates.email = email;
    }

    if (role !== undefined) {
      if (!VALID_ROLES.includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role provided'
        });
      }

      if (!isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Only admin can change roles'
        });
      }

      updates.role = role;
    }

    if (phone !== undefined) {
      updates.phone = phone;
    }

    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status provided'
        });
      }

      if (!isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Only admin can change user status'
        });
      }

      updates.status = status;
    }

    const updatedUser = await updateUserById(targetUserId, updates);

    if (status !== undefined && updatedUser.role === 'employee') {
      await updateEmployeeStatusByUserId(targetUserId, status);
    }

    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    const targetUserId = Number(req.params.id);
    const targetUser = await findUserById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isAdmin = req.user.role === 'admin';

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await deleteUserById(targetUserId);

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};
