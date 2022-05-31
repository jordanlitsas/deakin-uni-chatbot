const request = require('request-promise');
const callGraphApi = async (requestBody) => {
    await request({
      "uri": "https://graph.facebook.com/v2.6/me/messages",
      "qs": { "access_token": process.env.ACCESS_TOKEN },
      "method": 'POST',
      "json": requestBody
    });
  }


  module.exports = {
      callGraphApi
    }