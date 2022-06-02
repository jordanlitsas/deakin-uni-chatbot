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

const not = require('./services/topic/notificationService')
app.post('/open', async (req, res) => {
  let r = await not.getNotifications(req.body.psId);
  res.status(200).send(r);
})

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));
