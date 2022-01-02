const { Router } = require('express');
const { userController } = require('../controllers/userController');
const usersRouter = new Router();
module.exports = { usersRouter };

usersRouter.post('/login', userController.loginUser); // {host}/login
usersRouter.post('/register', userController.registerUser); // {host}/register
usersRouter.get('/', userController.getValidity); // {host}/