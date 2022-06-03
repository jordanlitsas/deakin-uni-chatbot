'use strict';

require('dotenv').config();
const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json());

const webhookRoute = require('./routes/messages/webhookRoute');
app.use('/webhook', webhookRoute);

const notificationRoute = require('./routes/messages/notificationRoute');
app.use('/notification', notificationRoute);
const tmp = require('./controllers/messages/webhookController');

app.post('/test', (req, res) => {
  tmp.receivePrompt(req, res);
})

// const not = require('./controllers/messages/notificationController')
// app.post('/open', async (req, res) => {
//   not.notifyUser(req, res);

// })

// const not2 = require('./services/topic/notificationService')
// app.post('/open', async (req, res) => {
//   let docs = await not2.setNotification(req.body.psid);
//   res.send(docs)

// })

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));
