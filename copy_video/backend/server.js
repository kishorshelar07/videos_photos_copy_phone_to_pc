const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const fse = require("fs-extra");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

// Fetch files from the source folder
app.post("/files", (req, res) => {
  const { sourcePath } = req.body;

  if (!sourcePath || !fs.existsSync(sourcePath)) {
    return res.status(400).json({ error: "Invalid source path." });
  }

  try {
    const files = fs
      .readdirSync(sourcePath)
      .filter(
        (file) =>
          file.endsWith(".mp4") || file.endsWith(".mov") // Filter video files
      );
    res.json({ files });
  } catch (error) {
    res.status(500).json({ error: "Error reading files." });
  }
});

// Copy files from source to destination
app.post("/copy", async (req, res) => {
  const { sourcePath, destinationPath } = req.body;

  if (!sourcePath || !destinationPath) {
    return res.status(400).json({ error: "Invalid paths provided." });
  }

  try {
    const files = fs
      .readdirSync(sourcePath)
      .filter(
        (file) =>
          file.endsWith(".mp4") || file.endsWith(".mov") // Filter video files
      );

    for (let file of files) {
      const src = path.join(sourcePath, file);
      const dest = path.join(destinationPath, file);
      await fse.copy(src, dest); // Copy files
    }

    res.json({ message: "Files copied successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error copying files." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
