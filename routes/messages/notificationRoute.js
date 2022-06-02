const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/messages/notificationController');

router.post('/', (req, res) => { Controller.notifyUser(req, res) });
router.get('/', (req, res) => { Controller.getNotificationDocs(req, res) });
module.exports = router;