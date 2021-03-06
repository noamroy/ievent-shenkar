//~~~~~~~~~INCLUDES~~~~~~~~~~~~
const User = require('../models/user');
const Log = require('./logger');
const jwt = require('jsonwebtoken')
//~~~~~~~EXPORTED FUNCTIONS~~~~~~~~~~
/*
POST REQUEST: loginUser() (body = name and pass params)
POST REQUEST: registerUser() (body = name and pass params)
GET REQUEST: getValidity() (body = name)
*/
exports.userController = {
    async loginUser(req, res) {
        const userName = req.body.email;
        const userPassword = req.body.password;
        Log.logger.info(`LOGIN SYSTEM CONTROLLER REQ: Login Name:${userName}`);
        if (userName && userPassword) {
            const userDataResponse = await User.find({ email: userName })
                .catch(err => {
                    Log.logger.info(`LOGIN SYSTEM CONTROLLER ERROR: Database retriving error ${err}`);
                    res.status(503).json({ "status": 503, "msg": `Database retriving error ${err}` });
                    return;
                });
            if (userDataResponse.length != 0) {
                const userData = userDataResponse[0];
                if (userPassword == userData.password) {
                    jwt.sign({userData}, 'privatekey', { expiresIn: '30m'},(err, token) => {
                        if (err) {Log.logger(err) }
                        Log.logger.info(`Login SYSTEM CONTROLLER RES: Succesfull login: ${userData.name}`);
                        res.status(200).json({ "status": 200, "msg": `Succesfull login: ${userData.name}`,"type":`${userData.type}`,"id":`${userData.id}`,"name": `${userData.name}`, "token":token});        
                    });                    
                } else {
                    Log.logger.info(`Login SYSTEM CONTROLLER ERROR: Failed login attempt: ${userData.id}`);
                    res.status(401).json({ "status": 401, "msg": `Incorrect password` });
                }
            } else {
                Log.logger.info(`Login SYSTEM CONTROLLER ERROR: Failed login attempt`);
                res.status(401).json({ "status": 401, "msg": `Incorrect username` });
            }
        } else {
            Log.logger.info(`Login SYSTEM CONTROLLER ERROR: LOGIN INPUT ERRPR`);
            res.status(401).json({ "status": 401, "msg": `INPUT ERROR-Please enter username and password` });
        }
    },
    async registerUser(req, res) {
        Log.logger.info(`REGISTER SYSTEM CONTROLLER REQ: POST add a new user`);
        const body = req.body;
        console.log(body);
        var userId = 0;
        if (body.name && body.password && body.email && body.phone && body.type) {
            const name_duplicate = await User.find({name: body.name})
                .catch(err => {
                    Log.logger.info(`REGISTER SYSTEM CONTROLLER ERROR: Database retriving error`);
                    res.status(503).json({ "status": 503, "msg": `Database retriving error` });
                    return;
                });
            if (name_duplicate.length!=0){
                Log.logger.info(`REGISTER SYSTEM CONTROLLER ERROR: Name already exists`);
                res.status(400).json({ "status": 400, "msg": `Name already exists` });
                return;
            }
            const email_duplicate = await User.find({email: body.email})
                .catch(err => {
                    Log.logger.info(`REGISTER SYSTEM CONTROLLER ERROR: Database retriving error`);
                    res.status(503).json({ "status": 503, "msg": `Database retriving error` });
                    return;
                });
            if (email_duplicate.length!=0){
                Log.logger.info(`REGISTER SYSTEM CONTROLLER ERROR: Email already exists`);
                res.status(400).json({ "status": 400, "msg": `Email already exists` });
                return;
            }
            const phone_duplicate = await User.find({phone: Number(body.phone)})
                .catch(err => {
                    Log.logger.info(`REGISTER SYSTEM CONTROLLER ERROR: Database retriving error`);
                    res.status(503).json({ "status": 503, "msg": `Database retriving error` });
                    return;
                });
            if (phone_duplicate.length!=0){
                Log.logger.info(`REGISTER SYSTEM CONTROLLER ERROR: Phone already exists`);
                res.status(400).json({ "status": 400, "msg": `Phone already exists` });
                return;
            }
            const userDataResponse = await User.find()
                .catch(err => {
                    Log.logger.info(`REGISTER SYSTEM CONTROLLER ERROR: Database retriving error`);
                    res.status(503).json({ "status": 503, "msg": `Database retriving error` });
                    return;
                });
            if (userDataResponse.length!=0)
                userId = userDataResponse[(userDataResponse.length)-1].id+1;
            else
                userId=1;
            try {
                const newUser = new User({
                    id: userId,
                    name: body.name,
                    password: body.password,
                    email: body.email,
                    phone: body.phone,
                    type: body.type,
                });
                const result = newUser.save();
                Log.logger.info(`REGISTER SYSTEM CONTROLLER RES: User added id: ${body.name}`);
                res.json(result);
            } catch (err) {
                Log.logger.info(`REGISTER SYSTEM CONTROLLER ERROR: Error creating user ${err}`);
                res.status(503).json({ "status": 503, "msg": `Error creating user ${err}` });
            }
        } else {
            Log.logger.info(`REGISTER SYSTEM CONTROLLER ERROR: no Valid`);
            res.status(401).json({ "status": 401, "msg": `Please enter valid data` });
        }

    }
};