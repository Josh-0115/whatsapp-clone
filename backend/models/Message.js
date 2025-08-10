// models/Message.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  messageId: String,
  contactId: String,
  contactName: String,
  direction: String,
  text: String,
  status: String,
  rawPayload: Object,
  timestamp: { type: Number, default: () => Math.floor(Date.now() / 1000) }
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema, "processed_messages"); 
