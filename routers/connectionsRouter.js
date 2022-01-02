const { Router } = require('express');
const { connectionController } = require('../controllers/connectionController');
const connectionsRouter = new Router();
module.exports = { connectionsRouter };

connectionsRouter.get('/user/:id', connectionController.getEventsForUser); // {host}/api/connection/user/:id
connectionsRouter.get('/event/:id', connectionController.getUsersForEvent); // {host}/api/connection/event/:id
connectionsRouter.post('/', connectionController.createConnection); // {host}/api/connection/
connectionsRouter.delete('/', connectionController.deleteConnection); // {host}/api/connection/