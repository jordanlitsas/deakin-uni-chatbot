const unitService = require('../../services/topic/unitService');

const replies = {
    initiateConversation:  "Please send me your first unit. Use the three letter and three number format. Don't worry about capitals.",
    addUnit: "Please send me a unit code in a three letter, three number format. Don't worry about capitals. ",
    confirmAddedUnit:  "If this is incorrect, reply with 'no'. If this is correct and you want to add another," + 
                        " send me another unit code. Otherwise, send 'finished'",
    wrongUnit: "Ok, let's try that again. Send me your unit code you want to follow. For example to follow SIT737, any of the following will work:",
    finishAddingUnits: "Alright! I will now send you an overview of the rest of your semester.",
    userError: "I didn't quite get that, could you please enter that again?",
    resetUnits: "Okay, we have reset your units. Let's add new ones."

}


const initiateConversation = () => {
    return replies.initiateConversation;
}




/**
 * A unitcode signals to add the last unitcode sent. This is because a unitcode is confirmation for the last unitcode sent, 
 * if it is not the first. 
 * 
 * If this causes bugs, refactor to remove unitcode with psid if user says 'no', and add unitcode with psid if user says unitcode.
 * 
 * @param {*} newUserMessage message user just sent
 * @param {*} lastUserMessage the message sent befor newUserMessage
 * @param {*} lastBotMessage the last mesage the bot sent
 * @returns next response to user and option for db insert
 */
const getResponse = (newUserMessage, lastUserMessage) => {
    let action = null;
    let value = null;


    if (isUnit(newUserMessage)){
        if (isUnit(lastUserMessage)){
            action = "addUnit";
            value = lastUserMessage;
        }
        return {
            message:`You have sent me ${newUserMessage}. ` + replies.confirmAddedUnit, 
            options: [{action: action, value: value}]};
    }

    if (newUserMessage == "no"){
        return [replies.wrongUnit, "sit737", "SIT737", "SiT737"];
    }

    if (newUserMessage == "finished"){
        if (isUnit(lastUserMessage)){
            action = "addUnit";
            value = lastUserMessage;
        }
        return {
            message: replies.finishAddingUnits, 
            options: [
                {action: action, value: value}, 
                {action: "unitOverview", value: null}
            ]};
    }

    if (newUserMessage == "reset units"){
        return [replies.resetUnits, replies.addUnit];
    }


    return replies.userError;
}

const getOverviewResponses = (unitDocs) => {
    unitDocs = JSON.parse(unitDocs)
    let responses = [];
    for (let i = 0; i < unitDocs.length; i++){
        let assessmentOverview = unitDocs[i].unit_name + "\n";
        for (let j = 0; j < unitDocs[i].assessments.length; j++){
            if (unitDocs[i].assessments[j].end_date == ""){
                assessmentOverview += `${unitDocs[i].assessments[j].name} - ${unitDocs[i].assessments[j].value*100}%\n`;
            } else {
                assessmentOverview += `${unitDocs[i].assessments[j].name} - ${unitDocs[i].assessments[j].value*100}% - due ${unitDocs[i].assessments[j].end_date}\n`;
            }
        }
        responses.push(assessmentOverview);
    }
    return responses;
}


const isUnit = (message) => {
    let pattern = /[a-zA-Z]{3}.*[0-9]{3}/;
    if (message.length === 6 && message.match(pattern)){
        return true;
    }
    return false;
}

module.exports = { initiateConversation, getResponse, getOverviewResponses };