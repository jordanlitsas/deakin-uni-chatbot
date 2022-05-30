const request = require('request-promise');
const baseUri = "https://cloud-db.azurewebsites.net/api/";


const updateLastConversation =  async (conversation) => {
    var options = {
        'method': 'POST',
        'url': 'https://cloud-db.azurewebsites.net/api/AddConversation'+"?code=-yg1kZhCK196DlXHHB0JKY2JuL2bQQGiFa5FR9YF_yaAAzFuguQL9Q==",
        'headers': {
        },
        body:
        `{"psId": "${conversation.psId}",
        "userMessage": "${conversation.userMessage}",
        "botMessage": "${converesation.botMessage}"
        "topic": "${conversation.topic}"}`
      
      };

    let success = false;
    await request(options, async function (error, res, body) {
       if (!error && res.statusCode == 200){
           success = true;
       }
    });
    return success;
}

const getLastConversation = async (psid) => {

        var options = {
            'method': 'GET',
            'url': `${baseUri}GetLatestConversation?psId=${psid}&code=-yg1kZhCK196DlXHHB0JKY2JuL2bQQGiFa5FR9YF_yaAAzFuguQL9Q==`,
            'headers': {
            }
          };
    
        let topic = null;
        await request(options, async function(error, res, body){
            if (!error && res.statusCode == 200){
                body = JSON.parse(body);
                topic = body;
            } 
        });
        return topic;
    }




module.exports = {
    updateLastConversation,
    getLastConversation
};