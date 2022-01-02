//~~~~~~~~~INCLUDES~~~~~~~~~~~~
const Connection = require('../models/connection');
const Log = require('./logger');
//~~~~~~~EXPORTED FUNCTIONS~~~~~~~~~~
/*
GET REQUEST: getEventsForUser (path = '/user/:id')
GET REQUEST: getUsersForEvent (path = '/event/:id')
POST REQUEST: createConnection (body = all params except for id)
DELETE REQUEST: deleteConnection (body = eventId/ userId)
*/
exports.connectionController = {
    async getEventsForUser(req, res) {
        const userId = req.path.substring(6)
        Log.logger.info(`CONNECTION CONTROLLER REQ: Get events for user: ${userId}`);
        if (isNaN(userId)){
            Log.logger.info(`CONNECTION CONTROLLER RES: input is nan error "${userId}"`);
            res.status(400).json({status: 400 , msg: `Input is nan error "${userId}"`});
        }
        var eventsData = await Connection.find({ userId: Number(userId)})
            .catch(err => {
                Log.logger.info(`CONNECTION CONTROLLER ERROR: getting the data from db ${err}`);
                res.status(500).json({status: 500 , msg: `Server error`});
            });
        if (eventsData.length!=0){
            Log.logger.info(`CONNECTION CONTROLLER RES: Get all events for user: ${userId}`);
            res.json(eventsData);
        }
    },
    async getUsersForEvent(req, res) {
        const eventId = req.path.substring(7)
        Log.logger.info(`CONNECTION CONTROLLER REQ: Get users for event: ${eventId}`);
        if (isNaN(eventId)){
            Log.logger.info(`CONNECTION CONTROLLER RES: input is nan error "${eventId}"`);
            res.status(400).json({status: 400 , msg: `Input is nan error "${eventId}"`});
        }
        var usersData = await Connection.find({ eventId: Number(eventId)})
            .catch(err => {
                Log.logger.info(`CONNECTION CONTROLLER ERROR: getting the data from db ${err}`);
                res.status(500).json({status: 500 , msg: `Server error`});
            });
        Log.logger.info(`CONNECTION CONTROLLER RES: Get all users for event: ${eventId}`);
        res.json(usersData);
    },
    async createConnection(req, res) {
        Log.logger.info(`CONNECTION CONTROLLER REQ: POST add an connection`);
        const body = req.body;
        var mode = 0;
        var eventId = 0;
        var userId = 0;
        if (body.eventId){
            eventId =  Number(body.eventId);
            if (isNaN(eventId)){
                Log.logger.info(`CONNECTION CONTROLLER RES: input is nan error "${eventId}"`);
                res.status(400).json({status: 400 , msg: `Input is nan error "${eventId}"`});
                return;
            }
            mode +=1;
        }
        if (body.userId){
            userId =  Number(body.userId);
            if (isNaN(userId)){
                Log.logger.info(`CONNECTION CONTROLLER RES: input is nan error "${userId}"`);
                res.status(400).json({status: 400 , msg: `Input is nan error "${userId}"`});
                return;
            }
            mode +=2;
        }
        if (mode != 3){
            Log.logger.info(`CONNECTION CONTROLLER RES: input error`);
            res.status(400).json({status: 400 , msg: `Input error`});
            return;
        }
        const newConnection = new Connection({
            "eventId": eventId,
            "userId": userId,
        });
        const result = newConnection.save();
        if (result) {
            Log.logger.info(`CONNECTION CONTROLLER RES: add connection`);
            res.json(newConnection);
        } else {
            Log.logger.info(`CONNECTION CONTROLLER ERROR: server error ${err}`);
            res.status(500).json({status: 500 , msg: `Server error`});
        }
    },
    async deleteConnection(req, res) {
        Log.logger.info(`CONNECTION CONTROLLER REQ: DELETE`);
        const body = req.body;
        console.log(body);
        var mode = 0;
        var eventId = 0;
        var userId = 0;
        if (body.eventId){
            eventId = Number(body.eventId);
            if (isNaN(eventId)){
                Log.logger.info(`CONNECTION CONTROLLER RES: input is nan error "${eventId}"`);
                res.status(400).json({status: 400 , msg: `Input is nan error "${eventId}"`});
                return;
            }
            mode +=1;
        }
        if (body.userId){
            userId = body.userId;
            if (isNaN(userId)){
                Log.logger.info(`CONNECTION CONTROLLER RES: input is nan error "${userId}"`);
                res.status(400).json({status: 400 , msg: `Input is nan error "${userId}"`});
                return;
            }
            mode +=2;
        }
        if (mode == 3){
            Connection.deleteOne ({ userId: Number(userId), eventId: Number(eventId)})
                .then(docs => { res.json(docs)})
                .catch(err => {
                    Log.logger.info(`EVENT CONTROLLER ERROR: deleting event from db: ${err}`);
                    res.status(500).json({status: 500 , msg: `Server delete error`});
                });
            return;
        }
        else{
            Log.logger.info(`CONNECTION CONTROLLER RES: input error`);
            res.status(400).json({status: 400 , msg: `Input error`});
            return;
        }
    }
}