const express = require('express');

const authRouter = require('./auth');
const menuRouter = require('./menu');
const dashboardRouter = require('./dashboard');

const app = express();
app.use(authRouter);
app.use(menuRouter);
app.use(dashboardRouter);

module.exports = app;