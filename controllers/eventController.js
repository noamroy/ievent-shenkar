//~~~~~~~~~INCLUDES~~~~~~~~~~~~
const Event = require('../models/event');
const Log = require('./logger');
//~~~~~~~EXPORTED FUNCTIONS~~~~~~~~~~
/*
GET REQUEST: getAllEvents()
GET REQUEST: getSpecificEvent(path = '/id')
POST REQUEST: createEvent(body = all params except for id)
PUT REQUEST: updateEvent(path = '/id', body = all new params)
DELETE REQUEST: deleteEvent(path = '/id')
PATCH REQUEST: updateStatus()
*/
exports.eventController = {
    async getAllEvents(req, res) {
        Log.logger.info(`EVENT CONTROLLER REQ: Get all events`);
        const answer = await Event.find()
            .catch(err => {
                Log.logger.info(`EVENT CONTROLLER ERROR: getting the data from db ${err}`);
                res.status(500).json({status: 500 , msg: `Server error`});
            });
        if (answer.length!=0){
            Log.logger.info(`EVENT CONTROLLER RES: Get all events`);
            res.json(answer);
        }
        else{
            Log.logger.info(`EVENT CONTROLLER RES: no events in DB`);
            res.status(404).json({status: 404 , msg: `No events in DB`});
        }
    },
    async getSpecificEvent(req, res) {
        const eventId = req.path.substring(1)
        Log.logger.info(`EVENT CONTROLLER REQ: Get specific event number ${eventId}`);
        if (isNaN(eventId)){
            Log.logger.info(`EVENT CONTROLLER RES: input is nan error "${eventId}"`);
            res.status(400).json({status: 400 , msg: `Input is nan error "${eventId}"`});
        }
        else{
            var eventData = await Event.find({ id: Number(eventId)})
                .catch(err => {
                    Log.logger.info(`EVENT CONTROLLER ERROR: getting the data from db ${err}`);
                    res.status(500).json({status: 500 , msg: `Server error`});
                });
            if (eventData.length!=0){
                eventData = eventData[0];
                Log.logger.info(`EVENT CONTROLLER RES: get event data number: ${eventId}`);
                res.json(eventData);
            }
            else{
                Log.logger.info(`EVENT CONTROLLER RES: Didn't find event number: ${eventId}`);
                res.status(404).json({status: 404 , msg: `Didn't find event number: ${eventId}`});
            }
        }
    },
    async createEvent(req, res) {
        Log.logger.info(`EVENT CONTROLLER REQ: POST add an event`);
        const body = req.body;
        //console.log(body);
        var eventId = await Event.find()
            .catch(err => {
                Log.logger.info(`EVENT CONTROLLER ERROR: getting the data from db ${err}`);
                res.status(500).json({status: 500 , msg: `Server error`});
        });
        if (eventId.length!=0)
            eventId = eventId[(eventId.length)-1].id+1;
        else
            eventId=1;
        console.log(`id: ${eventId}`);
        console.log(`name: ${body.name}`);
        console.log(`location: ${body.location}`);
        console.log(`time: ${body.time}`);
        console.log(`description: ${body.description}`);
        console.log(`government: ${body.government}`);
        console.log(`status: wait for approval`);
        if (body.name && body.location && body.time){
            const newEvent = new Event({
                "id": eventId,
                "name": body.name,
                "location": body.location,
                "time": body.time,
                "description": body.description,
                "government": body.government,
                "status": "wait for approval"
            });
            const result = newEvent.save();
            if (result) {
                Log.logger.info(`EVENT CONTROLLER RES: add event number ${eventId}`);
                res.json(newEvent);
            } else {
                Log.logger.info(`EVENT CONTROLLER ERROR: getting the data from db ${err}`);
                res.status(500).json({status: 500 , msg: `Server error`});
            }
        } else {
            Log.logger.info(`EVENT CONTROLLER RES: Input error!`);
            res.status(400).json({status: 400 , msg: `Input error!`});
        }
    },
    async updateEvent(req, res) {
        const eventId = req.path.substring(1);
        Log.logger.info(`EVENT CONTROLLER REQ: update an event number: ${eventId}`);
        if (isNaN(eventId)){
            Log.logger.info(`EVENT CONTROLLER RES: input is nan error "${eventId}"`);
            res.status(400).json({status: 400 , msg: `Input is nan error "${eventId}"`});
        }
        else {
            var body = req.body;
            var event = await Event.find({ id: Number(eventId)})
                .catch(err => {
                    Log.logger.info(`EVENT CONTROLLER ERROR: getting the data from db ${err}`);
                    res.status(500).json({status: 500 , msg: `Server error`});
                });
            if (event.length == 0){
                Log.logger.info(`EVENT CONTROLLER RES: Didn't find event number: ${eventId}`);
                res.status(404).json({status: 404 , msg: `Didn't find event number: "${eventId}"`});
            }
            else {
                event = event[0];
                if (body.name)
                    event.name=body.name;
                if (body.location)
                    event.location=body.location;
                if (body.time)
                    event.time=body.time;
                if (body.description)
                    event.description=body.description;
                if (body.government)
                    event.government=body.government;
                if (body.status)
                    event.status=body.status;
                Event.updateOne({ id: eventId }, {
                    name: event.name,
                    location: event.location,
                    time: event.time,
                    description: event.description,
                    government: event.government,
                    status: event.status})
                    .catch(err => {
                        Log.logger.info(`EVENT CONTROLLER ERROR: update event ${err}`);
                        res.status(500).json({status: 500 , msg: `Error update a event`});
                    });
                res.json(body);
            }
        }
    },
    async deleteEvent(req, res) {
        const eventId = req.path.substring(1)
        Log.logger.info(`EVENT CONTROLLER REQ: Get specific event number ${eventId}`);
        if (isNaN(eventId)){
            Log.logger.info(`EVENT CONTROLLER RES: input is nan error "${eventId}"`);
            res.status(400).json({status: 400 , msg: `Input is nan error "${eventId}"`});
        }
        else{
            Log.logger.info(`EVENT CONTROLLER RES: delete event number: ${eventId}`);
            Event.deleteOne ({ id: Number(eventId)})
                .then(docs => { res.json(docs)})
                .catch(err => {
                    Log.logger.info(`EVENT CONTROLLER ERROR: deleting event from db: ${err}`);
                    res.status(500).json({status: 500 , msg: `Server delete error`});
                });
        }
    },
    async updateStatus(req, res){
        Log.logger.info(`EVENT CONTROLLER REQ: Update events status`);
        const answer = await Event.find()
            .catch(err => {
                Log.logger.info(`EVENT CONTROLLER ERROR: getting the data from db ${err}`);
                res.status(500).json({status: 500 , msg: `Server error`});
            });
        for (let index = 0; index < answer.length; index++) {
            const element = answer[index];
            const eventTime = element.time;
            const eventstatus = element.status;
            if (eventTime+(1000*60*60*10)<new Date()){
                Event.updateOne({ id: element.id }, {
                    status: "passed"})
                    .catch(err => {
                        Log.logger.info(`EVENT CONTROLLER ERROR: update event status ${err}`);
                        res.status(500).json({status: 500 , msg: `Error update a event status`});
                });
            }
            else if (eventTime-(1000*60*60*2)<new Date()){
                if (eventstatus == "approved")
                Event.updateOne({ id: element.id }, {
                    status: "now"})
                    .catch(err => {
                        Log.logger.info(`EVENT CONTROLLER ERROR: update event status ${err}`);
                        res.status(500).json({status: 500 , msg: `Error update a event status`});
                });
            }
        }
        Log.logger.info(`EVENT CONTROLLER RES: update all events status`);
        res.json({status: 200 , msg: `update all events status`});
    }
};
