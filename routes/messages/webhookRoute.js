const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/messages/webhookController');

router.post('/', (req, res) => { console.log(req.body); Controller.sendMessage(req, res) });
router.get('/', (req, res) => { Controller.verifyWebhook(req, res)});
module.exports = router;