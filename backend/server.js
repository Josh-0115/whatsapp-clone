require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const webhookRoutes = require("./routes/webhookRoutes");
const http = require("http");

const cors = require('cors');
app.use(cors({
  origin: ["http://localhost:5173", "https://your-frontend-domain.com"],
  methods: ["GET", "POST"]
}));

const app = express();
connectDB();


app.use(bodyParser.json());

// We'll attach socket.io to this server
const server = http.createServer(app);

// Allow CORS origins for socket connection (restrict in production)
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173","http://localhost:3000"], // frontend origin(s)
    methods: ["GET","POST"]
  }
});

// make io available to controllers via app.locals
app.locals.io = io;

app.use("/api", webhookRoutes);

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
  app.use(express.static(path.join(__dirname, "client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/dist", "index.html"));
  });
}
