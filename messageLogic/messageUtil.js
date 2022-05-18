const unitManager = require('./messageManager/unitManager')
const sanitiseMessage = (message) => {
    let sanitisedMessage = message.toLowerCase();
    sanitisedMessage = sanitisedMessage.trim();
    return sanitisedMessage;
}


const isKeyword = (message) => {
    switch (message){
        case 'get started':
            responseText = unitManager.initiateConversation(message);
            return responseText;
            
        default: 
            return null;
    }    
}

module.exports = { sanitiseMessage, isKeyword };