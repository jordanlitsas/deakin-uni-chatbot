const request = require('request');
const baseUri = "https://cloud-db.azurewebsites.net/api/";


const updateLastConversation =  async (conversation) => {
    var options = {
        'method': 'POST',
        'url': 'https://cloud-db.azurewebsites.net/api/AddConversation'+"?code=-yg1kZhCK196DlXHHB0JKY2JuL2bQQGiFa5FR9YF_yaAAzFuguQL9Q==",
        'headers': {
        },
        body: `{"psId": "${conversation.psId}","conversation": "${conversation.conversation}","topic": "${conversation.topic}"}`
      
      };

    request(options, function (error, response) {
        if (error){
            return null;
        };
        return response;
    });
}

const getLastConversation = async (psid) => {
    var options = {
        'method': 'GET',
        'url': `${baseUri}GetLatestConversation?psId=${psid}&code=-yg1kZhCK196DlXHHB0JKY2JuL2bQQGiFa5FR9YF_yaAAzFuguQL9Q==`,
        'headers': {
        }
      };
   request(options, (error, response) => {
    if (error){
        return null;
    }
    return response.body;
   })
}

module.exports = {
    updateLastConversation,
    getLastConversation
};