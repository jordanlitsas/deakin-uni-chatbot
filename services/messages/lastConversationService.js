const request = require('request-promise');
const baseUri = "https://cloud-db.azurewebsites.net/api/";


const updateLastConversation =  async (conversation) => {
    try{
        var options = {
            'method': 'POST',
            'url': 'https://cloud-db.azurewebsites.net/api/AddConversation?code=f9s6gy32sXPAgP1J4pwTy_rSU_88YcfL6RsP3vs6PTdOAzFuLFJRqQ==',
            'headers': {
            },
            body: `{
                "psId": "${conversation.psId}",
                "userMessage":"${conversation.userMessage}",
                "botMessage":"${conversation.botMessage}", 
                "topic":"${conversation.topic}"
            }`
        };
        console.log(options.body)

    
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
        // console.log(error)
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