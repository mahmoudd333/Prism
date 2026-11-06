const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
}));

app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
  res.json({ message: "Prism backend is running!" });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Prism backend is awake",
  });
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/knowledge", require("./routes/knowledgeBase"));
app.use("/api/chat", require("./routes/chat"));
app.use("/api/conversations", require("./routes/conversations"));
app.use("/api/analytics", require("./routes/analytics"));

app.get("/api/admin/verify", (req, res) => {
  const authorization = req.headers.authorization || "";
  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (payload.role !== "admin" || !payload.sub) {
      return res.status(403).json({ message: "Access denied." });
    }

    return res.json({ authenticated: true });
  } catch {
    return res.status(401).json({
      message: "Your session is invalid or expired. Please sign in again.",
    });
  }
});

async function startServer() {
  try {
    if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
      throw new Error("MONGODB_URI and JWT_SECRET must be set in .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB Atlas");

    app.listen(PORT, () => {
      console.log(`Prism backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Backend startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
