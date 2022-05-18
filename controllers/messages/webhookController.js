const messageLogicRouter = require('../../messageLogic/messageLogicRouter')
const request = require('request');

const sendMessage = (req, res) => {

    let body = req.body;
 
  
      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {

        // Gets the body of the webhook event
        let webhookEvent = entry.messaging[0];      
      
        // Get the sender PSID
        let sendPsid = webhookEvent.sender.id;
      
        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        if (webhookEvent.message) {
            let responseText = messageLogicRouter.routeMessage(webhookEvent.message.text);
            let requestBody = {
              "recipient": {
                "id": sendPsid
              },
              "message": {"text": responseText}
            };
            request({
              "uri": "https://graph.facebook.com/v2.6/me/messages",
              "qs": { "access_token": process.env.ACCESS_TOKEN },
              "method": "POST",
              "json": requestBody
            }, (err, res, body) => {
              if (!err) {
                if (res.statusCode == 200){
                  
                }
              } else {
                console.error("Unable to send message:" + err);
              }
            });  
      }
    
    });
       
      // Returns a '200 OK' response to all requests
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
    verifyWebhook
}