const { Router } = require('express');
const { eventController } = require('../controllers/eventController');
const eventsRouter = new Router();
module.exports = { eventsRouter };

eventsRouter.get('/', eventController.getAllEvents); // {host}/api/event
eventsRouter.get('/:id', eventController.getSpecificEvent); // {host}/api/event/:id
eventsRouter.post('/', eventController.createEvent); // {host}/api/event
eventsRouter.put('/:id', eventController.updateEvent); // {host}/api/event/:id
eventsRouter.delete('/:id', eventController.deleteEvent); // {host}/api/event/:id
eventsRouter.patch('/', eventController.updateStatus) // {host}/api/event