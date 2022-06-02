const messageService = require('../messages/messageService');
const unitService = require('./unitService');
const notificationManager = require('../../messageLogic/messageManager/notificationManager');
const request = require('request-promise');

const setNotification = async (psid, interval, lastUpdated) => {

    let body = {
        "psId": psid,
        "interval": interval,
        "lastUpdated":"notNotified"
    };
    body = JSON.stringify(body)
    let options = {
        'method': 'POST',
        'url': `https://cloud-db.azurewebsites.net/api/AddNotification?code=-yg1kZhCK196DlXHHB0JKY2JuL2bQQGiFa5FR9YF_yaAAzFuguQL9Q==`,
        'headers': {},
        'body': body
    };

    await request(options, async function (error, res, body) {
        if (!error && res.statusCode == 200){
              console.log(body);
              return body;
        }
    });
    return {error: ""}
}

const getNotifications = async (psid) => {
    let options = {
        'method': 'GET',
        'url': `https://cloud-db.azurewebsites.net/api/GetNotifications?code=-yg1kZhCK196DlXHHB0JKY2JuL2bQQGiFa5FR9YF_yaAAzFuguQL9Q==&psId=${psid}`
    };
    await request(options, async function(error, res, body){
        if (!error && res.statusCode == 200){
            console.log(body);
            return body;
        }
        return error;
    })
    
}



module.exports = {setNotification, getNotifications};