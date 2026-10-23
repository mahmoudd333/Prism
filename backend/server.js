const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Prism backend is running!" });
});

app.listen(PORT, () => {
  console.log(`Prism backend running on port ${PORT}`);
});
