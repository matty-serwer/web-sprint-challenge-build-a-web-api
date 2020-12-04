const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const actionsRouter = require('./actions/actions-router');
const projectsRouter = require('./projects/projects-router');
 
const server = express();

server.use(cors());
server.use(morgan('dev'));
server.use(express.json());

server.use('/api/actions', actionsRouter);
server.use('/api/projects', projectsRouter);

server.get('/', (req, res) => {
    res.send('<h1>Sprint Challange Baby!</h1>');
})


module.exports = server;
