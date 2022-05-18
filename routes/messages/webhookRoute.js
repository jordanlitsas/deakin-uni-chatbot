const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/messages/webhookController');

router.post('/', (req, res) => { Controller.sendMessage(req, res) });

module.exports = router;