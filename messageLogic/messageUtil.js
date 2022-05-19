const { response } = require('express');
const unitManager = require('./messageManager/unitManager');
const notificationManager = require('./messageManager/notificationManager');
const sanitiseMessage = (message) => {
    let sanitisedMessage = message.toLowerCase();
    sanitisedMessage = sanitisedMessage.trim();
    return sanitisedMessage;
}


const isKeyword = (message) => {
    let responseText, conversationResponse;
    switch (message){

        case 'help':
            responseText = [
                'Send "add units" to add units or "reset units" to reset units.',
                'Send "notifications" to tell me how often to remind you of your assessments"'
            ];
            conversationResponse = {topic: "help", message: responseText};
            return conversationResponse;

        case 'get started':
            responseText = [
                "Welcome to Ask Alfred. If you get stuck at any time, just send 'help'. Let's start adding your units",
             `${unitManager.initiateConversation()}`
            ];
            conversationResponse = {topic: "addUnit", message: responseText};
            return conversationResponse;

        case 'add units':
            responseText = unitManager.initiateConversation();
            conversationResponse = {topic: "addUnit", message: responseText, options: "addUnit"};
            return conversationResponse;
        
        case 'reset units':
            responseText = unitManager.getResponse(message);
            //because after resetting units the conversation flows into adding units, the topic is addUnit
            conversationResponse = {topic: "addUnit", message: responseText, options: "resetUnits"}; 
            return conversationResponse;

        case 'notifications':
            responseText = notificationManager.initiateConversation();
            conversationResponse = {topic: 'notifications', message: responseText}
            
        default: 
            return null;
    }    
}



module.exports = { sanitiseMessage, isKeyword };