const messageUtil = require('./messageUtil');
const lastConversationService = require('../services/messages/lastConversationService')
const unitManager = require("./messageManager/unitManager");
const notificationManager = require('./messageManager/notificationManager')

const routeMessage = async (senderPsid, messageText) => {
    let message = messageUtil.sanitiseMessage(messageText);

    // if it's a new conversation keyword, get response and topic locally
    let firstResponse = messageUtil.isKeyword(message);
    if (firstResponse != null){
        return firstResponse;
    }

    
    // if it is an ongoing conversation, query the db for the LastConversation doc

    let doc = await lastConversationService.getLastConversation(senderPsid);
    let response;
    switch(doc.topic){
        case "addUnits":
            response = unitManager.getResponse(message, doc.conversation);        
            return {topic: "addUnits", botMessage: response.message, options: response.options};

        case "notifications":   
            response = notificationManager.getResponse(message, doc.conversation);
            return {topic: "notifications", botMessage: response.message, options: response.options};

        case "instantupdate":   
            response = instantUpdateManager.getResponse(message, doc.conversation);
            return {topic: "instantupdate", botMessage: response.message, options: response.options};
        case "calculateGrade":   
            response = gradeCalcManager.getResponse(message, doc.conversation);
            return {topic: "calculateGrade", botMessage: response.message, options: response.options};
    }  
    
}



module.exports = { routeMessage };
