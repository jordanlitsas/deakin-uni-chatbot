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


// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));
