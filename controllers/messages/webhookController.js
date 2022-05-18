const messageLogicRouter = require('../../messageLogic/messageLogicRouter')


const sendMessage = (req, res) => {

    let body = req.body;
 
  
      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {

        // Gets the body of the webhook event
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);
      
      
        // Get the sender PSID
        let sender_psid = webhook_event.sender.id;
        console.log('Sender PSID: ' + sender_psid);
      
        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        if (webhook_event.message) {
          handleMessage(sender_psid, webhook_event.message);   
          let responseText = messageLogicRouter.routeMessage(webhook_event.message.text);
          console.log(responseText)
     
        } else if (webhook_event.postback) {
          handlePostback(sender_psid, webhook_event.postback);
        }
        
      });
      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');

}

module.exports = {
    sendMessage
}