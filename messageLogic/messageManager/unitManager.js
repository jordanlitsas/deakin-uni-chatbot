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


const actionDatabase = (senderPsid, newUserMessage, lastUserMessage, lastBotMessage) => {
    if (isUnit(newUserMessage) || newUserMessage == "finished"){
        //upload lastUserMessage as a new unit associated with the psid
    }

    if (newUserMessage == "reset units"){
        //reset units associated with psid
    }
}

const getResponse = (message) => {
    
    if (isUnit(message)){
        return `You have sent me ${message}.` + replies.confirmAddedUnit;
    }

    if (message == "no"){
        return [replies.wrongUnit, "sit737", "SIT737", "SiT737"];
    }

    if (message == "finished"){
        //query unit summaries
        return replies.finishAddingUnits;
    }

    if (message == "reset units"){
        return [replies.resetUnits, replies.addUnit];
    }


    return replies.userError;
}



const isUnit = (message) => {
    let pattern = /[a-zA-Z]{3}.*[0-9]{3}/;
    if (message.length === 6 && message.match(pattern)){
        return true;
    }
    return false;
}

module.exports = { initiateConversation, getResponse };