const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const Message = require("./models/Message");

// Load env vars in non-production
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.join(__dirname, ".env") });
}

const app = express();

// CORS setup
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://whatsapp-clone-p6xvzy997-sunny-joshs-projects.vercel.app"
    ],
    methods: ["GET", "POST"]
  })
);

// Connect to DB
connectDB();

// Middleware
app.use(express.json());
app.use(bodyParser.json());

// Messages route (✅ placed after app is initialized)
app.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// HTTP + Socket.io server setup
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://whatsapp-clone-p6xvzy997-sunny-joshs-projects.vercel.app"
    ],
    methods: ["GET", "POST"]
  }
});

// Make io available to controllers via app.locals
app.locals.io = io;

// Routes
app.use("/api/webhook", require("./routes/webhookRoutes"));

// Optional: basic socket logging
io.on("connection", (socket) => {
  console.log("⚡️ Socket connected:", socket.id);
  socket.on("disconnect", () =>
    console.log("🔌 Socket disconnected:", socket.id)
  );
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
