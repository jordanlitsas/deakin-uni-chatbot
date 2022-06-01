const replies = {
    initiateConversation:  `When would you like me to provide you with a notification about your upcoming assessments? Every 'week', 'fortnight' or 'month'`
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


const buildAssessmentNotificationMessage = (assessment) => {
    let response = `${assessment.name} - ${assessment.weight} \r\n${assessment.output}\r\nDue: ${assessment.due}`;
    return response;
}

module.exports = {
    initiateConversation,
    getResponse,
    buildAssessmentNotificationMessage
}