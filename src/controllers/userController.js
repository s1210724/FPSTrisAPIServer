const userService = require('../services/userService');
const authController = require('./authController');

async function getUsers(req, res, next) {
  try {
    const limit = Number(req.query.limit) || 25;
    const users = await userService.getUsers(limit);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}

async function createUser(req, res, next) {
  try {
    const createdUser = await userService.createUser(req.body);
    const logInAfterRegister = String(process.env.USER_LOGGED_IN_AFTER_REGISTER ?? '').toLowerCase() === 'true';
    if (logInAfterRegister) {
      const token = await authController.login(req, res);
    } else {
      res.status(201).json(createdUser);
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUsers,
  createUser
};
