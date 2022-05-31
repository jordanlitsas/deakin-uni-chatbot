'use strict';

require('dotenv').config();
const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json());

const webhookRoute = require('./routes/messages/webhookRoute');
app.use('/webhook', webhookRoute);

const tmp = require('./controllers/messages/webhookController');
app.post('/test', (req, res) => {
  tmp.receivePrompt(req, res);
})

const ov = require('./messageLogic/messageManager/unitManager');
app.post('/ov', (req, res) => {
  ov.getOverviewResponses();
})

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));
