const bcrypt = require('bcrypt');

const { createUser, findUserByEmail } = require('../models/userModel');
const { generateToken } = require('../utils/jwt');

const VALID_ROLES = ['admin', 'analyst', 'employee'];
const SALT_ROUNDS = 10;

async function register(req, res, next) {
  try {
    const { name, password, role, phone } = req.body;
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';

    if (!name || !email || !password || !role || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, role, and phone are required'
      });
    }

    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role provided'
      });
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await createUser({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      status: 'active'
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const rawEmail = req.body.email;
    const password = req.body.password;
    const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : '';

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No data found for this email'
      });
    }

    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'User account is inactive'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }

    const token = generateToken({
      id: user.id,
      role: user.role,
      email: user.email
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          status: user.status
        }
      }
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login
};
