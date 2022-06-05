const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/messages/webhookController');

router.post('/', (req, res) => { 
    Controller.receivePrompt(req, res) 
});
router.get('/', (req, res) => { Controller.verifyWebhook(req, res)});
module.exports = router;