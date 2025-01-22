import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import emailRoutes from "./routes/emailRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import connectDB from "./utils/db.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

// API Routes
app.use("/email", emailRoutes);
app.use("/image", imageRoutes);

app.use((req, res, next) => {
  if (
    process.env.NODE_ENV === "production" &&
    req.headers["x-forwarded-proto"] !== "https"
  ) {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Backend is up and running!" });
});

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5000;
  const HOST = "0.0.0.0"; // Bind to all interfaces for Render
  const server = app.listen(PORT, HOST, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
  });
  server.keepAliveTimeout = 120000; // 2 minutes
  server.headersTimeout = 120000; // 2 minutes
}
