const request = require('request');
const baseUri = "https://cloud-db.azurewebsites.net/api/";


const updateLastConversation =  async (conversation) => {
    var options = {
    'method': 'POST',
    'url': `${baseUri}AddConversation?code=-yg1kZhCK196DlXHHB0JKY2JuL2bQQGiFa5FR9YF_yaAAzFuguQL9Q==`,
    'headers': {
    },
    body: `{\r\n    "psId": ${conversation.PSID},\r\n    "conversation": ${conversation.message},\r\n    "topic": ${conversation.topic}\r\n}`

    };
    request(options, function (error, response) {
        if (error){
            return null;
        };
        return response.body;
    });
    return null;
}

const getLastConversation = async (psid) => {
    var options = {
        'method': 'GET',
        'url': `${baseUri}GetLatestConversation?psId=${psid}&?code=-yg1kZhCK196DlXHHB0JKY2JuL2bQQGiFa5FR9YF_yaAAzFuguQL9Q==`,
        'headers': {
        }
      };
   request(options, (error, response) => {
    if (error){
        return null;
    }
    return response,body;
   })
   return null;
}

module.exports = {
    updateLastConversation,
    getLastConversation
};