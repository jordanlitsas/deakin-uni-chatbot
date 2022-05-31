const request = require('request-promise');
const baseUri = "https://cloud-db.azurewebsites.net/api/";


const updateLastConversation =  async (conversation) => {
    try{
        var options = {
            'method': 'POST',
            'url': 'https://cloud-db.azurewebsites.net/api/AddConversation'+"?code=-yg1kZhCK196DlXHHB0JKY2JuL2bQQGiFa5FR9YF_yaAAzFuguQL9Q==",
            'headers': {
            },
            body:`{
                \r\n    "psId": "${conversation.psId}",
                \r\n    "userMessage": "${conversation.userMessage}",
                \r\n    "botMessage": "${conversation.botMessage}",
                \r\n    "topic": "${conversation.topic}"\r\n}`
          };
      
    
        let success = false;
        await request(options, async function (error, res, body) {
           if (!error && res.statusCode == 200){
               success = true;
           }
        });
        console.log('SUCCESS updating last conversation')
        return success;
    }
    catch(error){
        console.log('ERROR updating last conversation')
        return null;
    }
    
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