const updateLastConversation =  async (conversation) => {

    //update last conversation in cloudant
    // for (var key in conversation){
    //     console.log(key + " : " + conversation[key]);
    // }
}

const getLastConversation = async (psid) => {
   return {
        PSID: psid,
        topic: "addUnit",
        message: "sit737",
        time: new Date()
    };
}

module.exports = {
    updateLastConversation,
    getLastConversation
};