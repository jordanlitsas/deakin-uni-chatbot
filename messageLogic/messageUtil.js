const sanitiseMessage = (message) => {
    let sanitisedMessage = message.toLowerCase();
    santisedMessage = santisedMessage.trim();
    return sanitisedMessage;
}


const isKeyword = (message) => {
    switch (message){
        case 'get started':
            responseText = unitManager.initiateConversation(message);
            return responseText;
            break;
        default: 
            return null;
            break;
    }    
}

module.exports = { sanitiseMessage, isKeyword };