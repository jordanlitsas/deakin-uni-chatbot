const messageLogicRouter = require('../../messageLogic/messageLogicRouter');
const lastConversationService = require('../../services/messages/lastConversationService');
const messageService = require('../../services/messages/messageService');
const unitService = require('../../services/topic/unitService');
const unitManager = require('../../messageLogic/messageManager/unitManager');
const request = require('request-promise');
const notificationService = require('../../services/topic/notificationService');
const notificationController = require('./notificationController');

const sendMessage = async (requestBody, conversationObject) => {
  messageService.callGraphApi("POST", requestBody);
        //on successful message, update the LastConversation doc to reference in future messages. Maintains state of convo.
        let conversation= {
          psId: requestBody.recipient.id,
          topic: conversationObject.topic,
          userMessage: conversationObject.userMessage,
          botMessage: conversationObject.botMessage
        };
          
        lastConversationService.updateLastConversation(conversation);
}



const receivePrompt =  async (req, res) => {
  let body = req.body;  

  //true if the request must be return from notificationController.notifyUser()
  let notificationTrigger = false;


      // Iterates over each entry - there may be multiple if batched
      await body.entry.forEach(async function(entry) {
        // Gets the body of the webhook event
        let webhookEvent = entry.messaging[0];     
        // Get the sender PSID
        let senderPsid = webhookEvent.sender.id;
        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        if (webhookEvent.message.text) {
          console.log(`${webhookEvent.message.text} by ${senderPsid}`);
        
  //           // indicate to user that the messaged was received with the typing indicator bubble ( . . . )
            messageService.callGraphApi({"recipient": {"id": `${senderPsid}`}, "sender_action": "typing_on"});

            let conversationObject = await messageLogicRouter.routeMessage(senderPsid, webhookEvent.message.text);
            // add new user message to object to be uploaded to last conversation doc
            conversationObject['userMessage'] = webhookEvent.message.text;


            if (typeof(conversationObject) != 'undefined'){

              if (Array.isArray(conversationObject.options)){                
                for (let i = 0; i < conversationObject.options.length; i++){
                  switch(conversationObject.options[i].action){
                    case "unitOverview":
                      let unitDocs = await unitService.getUnits(senderPsid);
                      let overviewResponses = unitManager.getOverviewResponses(unitDocs);
                      conversationObject.botMessage = [conversationObject.botMessage];
                      for (let j = 0; j < overviewResponses.length; j++){
                        conversationObject.botMessage.push(overviewResponses[j]);
                      }
                      break;
                    case "addUnit":
                      await unitService.addUnit(senderPsid, conversationObject.options[i].value);
                      break;
                    case "setNotification":
                      notificationService.setNotification(senderPsid, conversationObject.userMessage);
                      break;
                      case "notifyUser":
                        console.log("! notify user action")
                        notificationTrigger = true;
                        break;
                    case null:
                      break;
                  }
                }
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
                  await messageService.callGraphApi(requestBody);
                }
                let conversation = {
                  psId: senderPsid,
                  topic: conversationObject.topic,
                  userMessage: conversationObject.userMessage,
                  botMessage: conversationObject.botMessage
                };
                lastConversationService.updateLastConversation(conversation);
              }



              //send single response  
     
              else if (conversationObject.botMessage != null){
     
                let requestBody = {
                  "recipient": {
                    "id": senderPsid
                  },
                  "message": {"text": conversationObject.botMessage}
                };
                await messageService.callGraphApi(requestBody);
                let conversation = {
                  psId: senderPsid,
                  topic: conversationObject.topic,
                  userMessage: conversationObject.userMessage,
                  botMessage: conversationObject.botMessage
                };
                lastConversationService.updateLastConversation(conversation);
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
              await messageService.callGraphApi(requestBody);
            }
            
      }
      console.log(notificationTrigger)

      //Facebook requires early 200 code http response so a dummy req and res is used
    if (notificationTrigger){
      notificationController.notifyUser({body: {psid: senderPsid}}, null);
    } 
    res.status(200).send()
  });
 
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