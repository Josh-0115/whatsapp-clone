const express = require("express");
const { receivePayload, sendMessageDemo, getMessages } = require("../controllers/webhookControllers");

const router = express.Router();

router.post("/webhook", receivePayload);
router.post("/send", sendMessageDemo);
router.get("/messages", getMessages);

module.exports = router;
