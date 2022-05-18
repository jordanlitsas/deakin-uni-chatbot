const unitManager = require('./messageManager/unitManager');
const messageUtil = require('./messageUtil');

const routeMessage = (messageText) => {
    let message = messageUtil.sanitiseMessage(messageText);
    let responseText;

    let firstResponse = messageUtil.isKeyword(message);
    if (firstResponse != null){
        return firstResponse;
    }
    
}



module.exports = { routeMessage };
