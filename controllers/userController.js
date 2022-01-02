//~~~~~~~~~INCLUDES~~~~~~~~~~~~
const User = require('../models/user');
const Log = require('./logger');
//~~~~~~~EXPORTED FUNCTIONS~~~~~~~~~~
/*
POST REQUEST: loginUser() (body = name and pass params)
POST REQUEST: registerUser() (body = name and pass params)
GET REQUEST: getValidity() (body = name)
*/
exports.userController = {
    async loginUser(req, res) {
        const userName = req.body.name;
        const userPassword = req.body.password;
        Log.logger.info(`LOGIN SYSTEM CONTROLLER REQ: Login Name:${userName}`);
        if (userName && userPassword) {
            const userDataResponse = await User.find({ name: userName })
                .catch(err => {
                    Log.logger.info(`LOGIN SYSTEM CONTROLLER ERROR: Database retriving error ${err}`);
                    res.status(503).json({ "status": 503, "msg": `Database retriving error ${err}` });
                    return;
                });
            if (userDataResponse.length != 0) {
                const userData = userDataResponse[0];
                if (userPassword == userData.password) {
                    User.updateOne({ id: userData.id }, {
                        time: (new Date())+1000*60*30})
                        .catch(err => {
                            Log.logger.info(`USER CONTROLLER ERROR: update user time ${err}`);
                            res.status(500).json({status: 500 , msg: `Error update user time`});
                    });
                    Log.logger.info(`Login SYSTEM CONTROLLER RES: Succesfull login: ${userData.name}`);
                    res.status(200).json({ "status": 200, "msg": `Succesfull login: ${userData.name}` });
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
        if (body.name && body.password) {
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
                    time: "2021-12-28T12:00:00Z"
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

    },
    async getValidity(req, res) {
        Log.logger.info(`USER CONTROLLER REQ: check validity`);
        const body = req.body;
        if (body.id) {
            const userDataResponse = await User.find({ id: body.id })
                .catch(err => {
                    Log.logger.info(`User CONTROLLER ERROR: Database retriving error ${err}`);
                    res.status(503).json({ "status": 503, "msg": `Database retriving error ${err}` });
                    return;
                });
            if (userDataResponse.length == 0){
                Log.logger.info(`USER CONTROLLER RES: Didn't find user number: ${body.id}`);
                res.status(404).json({status: 404 , msg: `Didn't find user number: "${body.id}"`});
            }
            else{
                userData=userDataResponse[0];
                if (body.time > (new Date())){
                    Log.logger.info(`USER CONTROLLER RES: ${body.id} is Valid`);
                    res.status(200).json({"status": 200, "valid": "yes"});
                }
                else{
                    Log.logger.info(`USER CONTROLLER RES: ${body.id} is not Valid`);
                    res.status(200).json({"status": 200, "valid": "no"});
                }              
            }
        } else {
            Log.logger.info(`USER CONTROLLER RES: data in body not valid`);
            res.status(401).json({ "status": 401, "msg": `Please enter valid data` });
        }
    }
};