const express = require("express");
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header("Access-Control-Allow-Methods", "*");
    res.set('Content-Type', 'application/json');
    next();
});
const { usersRouter } = require("./routers/usersRouter");
app.use('/api/user', usersRouter);
app.use((req, res, next) => {
    const header = req.headers['authorization'];
    if(typeof header !== 'undefined') {
        const bearer = header.split(' ');
        const token = bearer[1];
        req.token = token;
        jwt.verify(req.token, 'privatekey', (err) => {
            if (err){
                console.log('AUTHORIZED ERROR: could not connect to the protected route');
                res.status(403).json({status: 403 , msg: `authorized error`});
            }
            else {
                console.log('AUTHORIZED SUCCESS');
                next();
            }
        })
    } else {
        console.log('AUTHORIZED ERROR: the authorization field is empty');
        res.status(403).json({status: 403 , msg: `forbidden`});
    }
});
const { eventsRouter } = require("./routers/eventsRouter");
app.use('/api/event', eventsRouter);
const { connectionsRouter } = require("./routers/connectionsRouter");
app.use('/api/connection', connectionsRouter);
app.unsubscribe((req, res) => {
    res.status(400).send('Something is wrong!');
});
app.listen(port, () => console.log(`Express server is running on port ${port}`));

