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

const tmp = require('./controllers/messages/webhookController');
app.post('/test', (req, res) => {
  tmp.receivePrompt(req, res);
})

const last = require('./services/messages/lastConversationService')
app.get('/last', async (req, res) => {
  let r = await last.getLastConversation(req.body.id);
  console.log(r)
})

app.post('/last', async (req, res) => {
  let r = await last.updateLastConversation({psId: req.body.psId, conversation: "sit737", topic: "addUnits"})
    console.log(r)
})


// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening on last-conv-db-access branch'));
