const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header("Access-Control-Allow-Methods", "*");
    res.set('Content-Type', 'application/json');
    next();
});

const { eventsRouter } = require("./routers/eventsRouter");
app.use('/api/event', eventsRouter);
const { usersRouter } = require("./routers/usersRouter");
app.use('/api/user', usersRouter);
const { connectionsRouter } = require("./routers/connectionsRouter");
app.use('/api/connection', connectionsRouter);

app.unsubscribe((req, res) => {
    res.status(400).send('Something is wrong!');
});

app.listen(port, () => console.log(`Express server is running on port ${port}`));