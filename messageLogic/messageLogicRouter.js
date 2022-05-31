const messageUtil = require('./messageUtil');
const lastConversationService = require('../services/messages/lastConversationService')
const unitManager = require("./messageManager/unitManager");

const routeMessage = async (senderPsid, messageText) => {
    let message = messageUtil.sanitiseMessage(messageText);

    // if it's a new conversation keyword, get response and topic locally
    let firstResponse = messageUtil.isKeyword(message);
    if (firstResponse != null){
        return firstResponse;
    }

    
    // if it is an ongoing conversation, query the db for the LastConversation doc

    let doc = await lastConversationService.getLastConversation(senderPsid);
    switch(doc.topic){
        case "addUnits":
            let response = unitManager.getResponse(messageText, doc.userMessage);        
            return {topic: "addUnits", botMessage: response.message, options: response.options};
    }  
    
}



module.exports = { routeMessage };
