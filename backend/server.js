const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const webhookRoutes = require("./routes/webhookRoutes");
const http = require("http");
const cors = require('cors');
const dotenv = require('dotenv');
const path = require("path");
const Message = require("./models/Message");


app.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.join(__dirname, '.env') });
}

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://whatsapp-clone-p6xvzy997-sunny-joshs-projects.vercel.app"
  ],
  methods: ["GET", "POST"]
}));


connectDB();

app.use(express.json());
app.use(bodyParser.json());

// We'll attach socket.io to this server
const server = http.createServer(app);

// Allow CORS origins for socket connection (restrict in production)
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://whatsapp-clone-p6xvzy997-sunny-joshs-projects.vercel.app"
    ], methods: ["GET", "POST"]
  }
});

// make io available to controllers via app.locals
app.locals.io = io;

app.use("/api/webhook", require("./routes/webhookRoutes"));
// app.get("/test", (req, res) => res.send("Server is running"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


// Optional: basic socket logging
io.on("connection", (socket) => {
  console.log("⚡️ Socket connected:", socket.id);
  socket.on("disconnect", () => console.log("🔌 Socket disconnected:", socket.id));
});


