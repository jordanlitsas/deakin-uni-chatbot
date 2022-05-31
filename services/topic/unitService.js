const request = require('request-promise');
const addUnit = async (psid, unitCode) => {
    try{
        var options = {
            'method': 'POST',
            'url': 'https://cloud-db.azurewebsites.net/api/AddUnitForUser?code=-yg1kZhCK196DlXHHB0JKY2JuL2bQQGiFa5FR9YF_yaAAzFuguQL9Q==',
            'headers': {
            },
            body:`{
                \r\n    "psId": "${psid}",
                \r\n    "unitId": "${unitCode}"
          }`};
      
    
        let success = false;
        await request(options, async function (error, res, body) {
           if (!error && res.statusCode == 200){
               success = true;
           }
        });
        console.log('SUCCESS updating adding unit')
        return success;
    }
    catch(error){
        console.log('ERROR adding unit ')
        console.log(error)
        return null;
    }
}


module.exports = {
    addUnit
}