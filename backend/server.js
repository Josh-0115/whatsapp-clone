const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const webhookRoutes = require("./routes/webhookRoutes");
const http = require("http");
const cors = require('cors');
const dotenv = require('dotenv'); // Add this line
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

app.use(cors({
  origin: ["https://whatsapp-clone-n6sr.onrender.com"],
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
    origin: ["https://whatsapp-clone-n6sr.onrender.com"], // frontend origin(s)
    methods: ["GET", "POST"]
  }
});

// make io available to controllers via app.locals
app.locals.io = io;

app.use("/api/webhook", require("./routes/webhookRoutes"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Optional: basic socket logging
io.on("connection", (socket) => {
  console.log("⚡️ Socket connected:", socket.id);
  socket.on("disconnect", () => console.log("🔌 Socket disconnected:", socket.id));
});

const path = require("path");

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "/frontend/dist");
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}
