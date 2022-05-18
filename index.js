//   curl -H "Content-Type: application/json" -X GET "https://ask-alfred-prototype.mybluemix.net/webhook" 
// curl -H "Content-Type: application/json" -X POST "https://ask-alfred-prototype.mybluemix.net/webhook" -d '{"object": "page", "entry": [{"messaging": [{"message": "TEST_MESSAGE"}]}]}'

'use strict';

require('dotenv').config();
const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()), // creates express http server
  request = require('request');



const webhookRoute = require('./routes/messages/webhookRoute');
app.use('/webhook', webhookRoute);




  // Handles message events
  const handleMessage = async (senderPsid, receivedMessage) => {
    
    let response;
  
    // Check if the message contains text
    if (receivedMessage.text) {    

        let textResponse = await determineResponse(receivedMessage.text);
        response = {"text": textResponse};
        // Sends the response message
        callSendAPI(senderPsid, response);  
    }  

   
  }

  


  const determineConversation = (message) => {
    switch(message){
        case "add unit":
            return "Please enter the unit code of the unit you would like to follow. Don't worry about capital letters. For example," + 
            " response with SIT737 or sit737";
            break;
        
        case "sit737":
            return `You are now following sit737.`;
            break;

        case "SIT737":
            return `You are now following SIT737.`;
            break;

        case "weekly":
            return 'Great, we will send you weekly reminders on Monday.';
            break;

        case "What is due this week?":
           return `All week: Sprint 1 Review\n18/05/2022: Lecture 9 due on OnTrack\n`;
           break;
    }
}





// Handles messagingPostbacks events
const handlePostback = (senderPsid, response) => {}

const callSendAPI = (sendPsid, response) => {
    let requestBody = {
        "recipient": {
          "id": sendPsid
        },
        "message": response
      };

      // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": process.env.ACCESS_TOKEN },
    "method": "POST",
    "json": requestBody
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 
}

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));
