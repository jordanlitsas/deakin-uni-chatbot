//   curl -H "Content-Type: application/json" -X GET "https://ask-alfred-prototype.mybluemix.net/webhook" 
// curl -H "Content-Type: application/json" -X POST "https://ask-alfred-prototype.mybluemix.net/webhook" -d '{"object": "page", "entry": [{"messaging": [{"message": "TEST_MESSAGE"}]}]}'

'use strict';

require('dotenv').config();
const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json());

const webhookRoute = require('./routes/messages/webhookRoute');
app.use('/webhook', webhookRoute);



// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));
