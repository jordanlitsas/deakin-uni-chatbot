const replies = {
    initiateConversation:  `When would you like me to provide you with a notification about your upcoming assessments? Every "week", "fortnight" or "month"`
}
const initiateConversation = () => {
    return replies.initiateConversation;
}
const getResponse = (newUserMessage, lastUserMessage) => {
    if (lastUserMessage == "notifications" && isInterval(newUserMessage)){
        return {
            message: `Ok, we will remind you every ${newUserMessage} of your assessments due in that coming ${newUserMessage}.`,
            options: [{action: "setNotification", value: newUserMessage}]
        }
    }
}

const isInterval = (string) => {
    if (string == "month" || string == "fortnight" || string == "week"){
        return true;
    }
    return false;
}



module.exports = {
    initiateConversation,
    getResponse
}