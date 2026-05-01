const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

const BOT_TOKEN = "PUT_YOUR_BOT_TOKEN_HERE";
const CHAT_ID = "PUT_YOUR_CHAT_ID_HERE";

app.post("/upload", upload.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    const filePath = req.file.path;

    const form = new FormData();
    form.append("chat_id", CHAT_ID);
    form.append("video", fs.createReadStream(filePath));

    await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendVideo`,
      form,
      {
        headers: form.getHeaders(),
      }
    );

    res.send("Video sent successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending video");
  }
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
