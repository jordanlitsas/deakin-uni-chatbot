const messageLogicRouter = require('../../messageLogic/messageLogicRouter');
const lastConversationService = require('../../services/messages/lastConversationService');
const request = require('request-promise');


const sendMessage = async (requestBody, conversationObject) => {
    await callGraphApi("POST", requestBody);
        //on successful message, update the LastConversation doc to reference in future messages. Maintains state of convo.
        let conversation= {
          psId: requestBody.recipient.id,
          topic: conversationObject.topic,
          userMessage: conversationObject.userMessage,
          botMessage: conversationObject.botMessage
        };
          
        lastConversationService.updateLastConversation(conversation).then(success => {
          if (!success){
              console.log('UPDATE CONV AFTER MESSAGE SENT - FAIL')
            } else {
              console.log('UPDATE CONV AFTER MESSAGE SENT - SUCCESS')
            }
        })
        
   
}

const callGraphApi = async (method, requestBody) => {
  await request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": process.env.ACCESS_TOKEN },
    "method": method,
    "json": requestBody
  });
}

const receivePrompt =  async (req, res) => {
  let body = req.body;  
      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(async function(entry) {
        // Gets the body of the webhook event
        let webhookEvent = entry.messaging[0];     
        // Get the sender PSID
        let senderPsid = webhookEvent.sender.id;
        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        if (webhookEvent.message) {
            
            // indicate to user that the messaged was received with the typing indicator bubble ( . . . )
            callGraphApi("POST", {"recipient": {"id": String(senderPsid)}, "sender_action": "typing_on"});

            let conversationObject = await messageLogicRouter.routeMessage(senderPsid, webhookEvent.message.text);
            
            // add new user message to object to be uploaded to last conversation doc
            conversationObject['userMessage'] = webhookEvent.message.text;
            if (typeof(conversationObject) != 'undefined'){
              switch(conversationObject.options){
                case "resetUnits":
                  // let success = await services.unitSerivce.resetUnits(senderPsid);
                  // if (!success){  conversationObject.message = null; }
                case "addUnit":
                  //let success = await services.unitService.addUnits(unitCode, senderPsid);
                  //if (!success){ conversationObject.message = null; }
                case null:
                  break;
              }
            

              //send multiple responses
              if (Array.isArray(conversationObject.botMessage)){
                for (let i = 0; i < conversationObject.botMessage.length; i++){
                  let requestBody = {
                    "recipient": {
                      "id": senderPsid
                    },
                    "message": {"text": conversationObject.botMessage[i]}
                  };
                  sendMessage(requestBody, conversationObject);
                }

              //send single response  
              } else if (conversationObject.botMessage != null){
                let requestBody = {
                  "recipient": {
                    "id": senderPsid
                  },
                  "message": {"text": conversationObject.botMessage}
                };
                sendMessage(requestBody, conversationObject);
              } 
          }
            
            // if an options request was unsuccessful, i.e., units were not reset in database
            else {
              let requestBody = {
                "recipient": {
                  "id": senderPsid
                },
                "message": {"text": "Something went wrong. Can you re-enter your last message?"}
              };
              sendMessage(requestBody, conversationObject);
            }
            
      }
      //Facebook requires early 200 code http response
  });
  res.status(200).send('EVENT_RECEIVED');
}
       



const verifyWebhook = (req, res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = process.env.VERIFY_TOKEN;
    
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
}


module.exports = {
    sendMessage,
    verifyWebhook, 
    receivePrompt
}