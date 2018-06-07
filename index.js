const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const apiRouter = require('./auth');

const app = express();

app.use(cors('*'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use('/api', apiRouter);

app.get('x', function (req, res) {
    res.send('Hello world from Node.js and Nginx')
})

const PORT = 3091;

app.listen(PORT, function (err) {
    if(err) throw err
    console.log('App is listening at port: '+PORT)
})
