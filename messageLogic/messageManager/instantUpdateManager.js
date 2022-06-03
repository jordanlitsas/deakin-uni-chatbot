const replies = {
    initiateConversation:  `I will happily update you on a unit. Can you please let me know the unit code and i'll get right on it!`,
    unitCodeResponse: `Thank-you! Your tasks this month include: `,
}

const getResponse = (newUserMessage, lastUserMessage) => {
    if (lastUserMessage == unitCode && isInterval(newUserMessage)){
        return {
            message: `Thank-you! Your tasks this month include:`,
            options: [{action: "instantUpdate", value: unitCode}]
        }
    }

    if (newUserMessage == "unit code"){
        return{
            message: replies.unitCodeResponse, 
        };
    }
}

const initiateConversation = () => {
    return replies.initiateConversation;
}


const unitCode = (string) => {
    if (string == "month" || string == "fortnight" || string == "week"){
        return true;
    }
    return false;
}




module.exports = {
    initiateConversation,
    unitCode,
    getResponse,
   
}