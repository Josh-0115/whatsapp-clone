// webhookControllers.js
const Message = require("../models/Message");
const BUSINESS_NUMBER = "918329446654"; // Your business number

exports.receivePayload = async (req, res) => {
  try {
    const payload = req.body;

    // WhatsApp payloads usually have: entry[0].changes[0].value
    const value =
      payload?.metaData?.entry?.[0]?.changes?.[0]?.value ||
      payload?.entry?.[0]?.changes?.[0]?.value;

    if (!value) {
      console.warn("⚠ No valid value in payload:", payload);
      return res.sendStatus(400);
    }

    // --- Handle new messages ---
    if (value.messages && value.messages.length > 0) {
      const msg = value.messages[0];
      const contact = value.contacts?.[0] || {};

      let contactId, contactName, direction;

      if (msg.from === BUSINESS_NUMBER) {
        // Outgoing
        contactId = msg.to || contact.wa_id || "unknown";
        contactName = contact.profile?.name || msg.to || "Unknown";
        direction = "outgoing";
      } else {
        // Incoming
        contactId = msg.from;
        contactName = contact.profile?.name || msg.from || "Unknown";
        direction = "incoming";
      }

      const savedMsg = await Message.updateOne(
        { messageId: msg.id },
        {
          $set: {
            messageId: msg.id,
            contactId,
            contactName,
            direction,
            text: msg.text?.body || "",
            status: "sent",
            rawPayload: payload,
            timestamp: parseInt(msg.timestamp) || Math.floor(Date.now() / 1000)
          }
        },
        { upsert: true }
      );

      // Emit to frontend
      req.app.locals.io.emit("new_message", {
        messageId: msg.id,
        from: msg.from,
        to: msg.to,
        body: msg.text?.body || "",
        name: contactName,
        timestamp: parseInt(msg.timestamp) || Math.floor(Date.now() / 1000)
      });
    }

    // --- Handle status updates ---
    if (value.statuses && value.statuses.length > 0) {
      const status = value.statuses[0];

      await Message.updateOne(
        { messageId: status.id },
        { $set: { status: status.status } }
      );

      // Emit status update
      req.app.locals.io.emit("status_update", {
        messageId: status.id,
        status: status.status
      });
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook Error:", err);
    res.sendStatus(500);
  }
};


// Add placeholder functions for the other routes
exports.sendMessageDemo = async (req, res) => {
  try {
    const { contactId, contactName, text } = req.body;

    if (!contactId || !text) {
      return res.status(400).json({ error: "Missing contactId or text" });
    }

    const newMsg = await Message.create({
      messageId: "demo-" + Date.now(),
      contactId,
      contactName: contactName || "Unknown",
      direction: "outgoing",
      text,
      status: "sent",
      rawPayload: {}
    });

    req.app.locals.io.emit("newMessage", newMsg);
    res.status(201).json(newMsg);
  } catch (err) {
    console.error("Send Message Demo Error:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
};


exports.getMessages = async (req, res) => {
    try {
        // Find all messages in the database and sort them chronologically
        const messages = await Message.find().sort({ timestamp: 1 });
        res.status(200).json(messages);
    } catch (err) {
        console.error("Error fetching messages:", err);
        res.status(500).json({ message: "Failed to fetch messages" });
    }
};