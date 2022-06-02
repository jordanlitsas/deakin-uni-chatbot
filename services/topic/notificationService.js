const messageService = require('../messages/messageService');
const unitService = require('./unitService');
const notificationManager = require('../../messageLogic/messageManager/notificationManager');
const request = require('request-promise');

const setNotification = async (psid, interval, lastUpdated) => {
    let existingDoc = await getNotifications(psid);
    
    if (existingDoc.length != 0){
        let body;
        for (let i = 0; i < existingDoc.length; i++){
            if (existingDoc[i].psId != "directory"){
                body = existingDoc[i];
            }
        }
        body.interval = interval;
        body = {payload: body};
        
        console.log(body)
        body = JSON.stringify(body)
         options = {
            'method': 'POST',
            'url': `https://cloud-db.azurewebsites.net/api/AddNotification?code=CbKyUn8kHV83K75juP-NncIB7iYQp8SlJ8l2Y7KCkIWDAzFuPzen6A==`,
            'headers': {},
            'body': body
        };
        await request(options, async function (error, res, body) {
            if (!error && res.statusCode == 200){
                  return body;
            }
        });
    } else {
        let directoryBody = {
            "psId": "directory",
            "interval": psid,
            "lastUpdated":psid,
        };
        directoryBody = JSON.stringify(directoryBody)
        let options = {
            'method': 'POST',
            'url': `https://cloud-db.azurewebsites.net/api/AddNotification?code=CbKyUn8kHV83K75juP-NncIB7iYQp8SlJ8l2Y7KCkIWDAzFuPzen6A==`,
            'headers': {},
            'body': directoryBody
        };
    
        request(options);

        let body = {
            "psId": psid,
            "interval": interval,
            "lastUpdated":"Not yet updated"
        };
        body = {payload: body};
        body = JSON.stringify(body)
         options = {
            'method': 'POST',
            'url': `https://cloud-db.azurewebsites.net/api/AddNotification?code=CbKyUn8kHV83K75juP-NncIB7iYQp8SlJ8l2Y7KCkIWDAzFuPzen6A==`,
            'headers': {},
            'body': body
        };
        await request(options, async function (error, res, body) {
            if (!error && res.statusCode == 200){
                  return body;
            }
        });
       
    }

   



    

   

   
    return {error: ""}
}

const getNotifications = async (psid) => {
    let options = {
        'method': 'GET',
        'url': `https://cloud-db.azurewebsites.net/api/GetNotifications?code=-yg1kZhCK196DlXHHB0JKY2JuL2bQQGiFa5FR9YF_yaAAzFuguQL9Q==&psId=${psid}`
    };
    let response = {};
    await request(options, async function(error, res, body){
        if (!error && res.statusCode == 200){
            
            response = JSON.parse(body);
        }
        return error;
    })
    return response;
    
}



module.exports = {setNotification, getNotifications};