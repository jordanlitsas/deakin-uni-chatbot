const replies = {
    initiateConversation:  `When would you like me to provide you with a notification about your upcoming assessments? Every 'week', 'fortnight' or 'month'`,
    comingUp: "One moment, I'll see what's due soon",
    userError: "I didn't quite get that, could you please enter that again?"

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

    if (newUserMessage == "coming up"){
        return{
            message: replies.comingUp,
            options:[{action: "notifyUser", value: null}]
        };
    }

    return{
        message: replies.userError,
        options:[{}]
    }
}

const isInterval = (string) => {
    if (string == "month" || string == "fortnight" || string == "week"){
        return true;
    }
    return false;
}


const buildAssessmentNotificationMessage = (assessment) => {
    let response = `${assessment.name} - ${assessment.weight} \r\n${assessment.output}\r\nDue: ${assessment.due}`;
    return response;
}

module.exports = {
    initiateConversation,
    getResponse,
    buildAssessmentNotificationMessage
}