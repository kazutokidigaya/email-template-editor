import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import emailRoutes from "./routes/emailRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import connectDB from "./utils/db.js";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

// API Routes
app.use("/email", emailRoutes);
app.use("/image", imageRoutes);

// Redirect HTTP to HTTPS in production
app.use((req, res, next) => {
  if (
    process.env.NODE_ENV === "production" &&
    req.headers["x-forwarded-proto"] !== "https"
  ) {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

// Health Check Endpoint
app.get("/", (req, res) => {
  res.status(200).json({ message: "Backend is up and running!" });
});

// Self-Pinging to Keep Server Active
const pingServer = () => {
  const serverUrl = process.env.SERVER_URL || "http://localhost:5000";
  setInterval(async () => {
    try {
      console.log(`Pinging server: ${serverUrl}`);
      await axios.get(serverUrl);
    } catch (error) {
      console.error(`Error pinging server: ${error.message}`);
    }
  }, 5 * 60 * 1000); // Ping every 5 minutes
};

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5000;
  const HOST = "0.0.0.0"; // Bind to all interfaces for Render
  const server = app.listen(PORT, HOST, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
    pingServer(); // Start the self-pinging function
  });
  server.keepAliveTimeout = 120000; // 2 minutes
  server.headersTimeout = 120000; // 2 minutes
}
