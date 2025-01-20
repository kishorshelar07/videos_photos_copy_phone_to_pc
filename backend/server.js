const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const fse = require("fs-extra");
const cors = require("cors");

const app = express();
const PORT = 5000;

let isCopying = false; // Flag to control the copying process

app.use(bodyParser.json());
app.use(cors());

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
          file.endsWith(".mp4") || file.endsWith(".mov")
      );
    res.json({ files });
  } catch (error) {
    res.status(500).json({ error: "Error reading files." });
  }
});

app.get("/copy", async (req, res) => {
  const { sourcePath, destinationPath } = req.query;

  if (!sourcePath || !destinationPath) {
    return res.status(400).json({ error: "Invalid paths provided." });
  }

  try {
    const files = fs
      .readdirSync(sourcePath)
      .filter(
        (file) =>
          file.endsWith(".mp4") || file.endsWith(".mov")
      );

    const batchSize = 50;
    let totalFiles = files.length;
    let copiedFiles = 0;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    isCopying = true; // Set the flag to indicate copying is in progress

    for (let i = 0; i < files.length && isCopying; i += batchSize) {
      const currentBatch = files.slice(i, i + batchSize);

      for (let file of currentBatch) {
        if (!isCopying) {
          // If stop signal received, break out of the loop
          res.write("data: {\"progress\": 0}\n\n");
          res.end();
          return;
        }

        const src = path.join(sourcePath, file);
        const dest = path.join(destinationPath, file);
        // Log copying process in the console
        console.log(`Copying ${file} from ${src} to ${dest}`);
        await fse.copy(src, dest);
        copiedFiles++;
      }

      const progress = Math.min((copiedFiles / totalFiles) * 100, 100);
      const progressData = JSON.stringify({ progress });
      res.write(`data: ${progressData}\n\n`);

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    if (isCopying) {
      res.write("data: {\"progress\": 100}\n\n");
      res.end();
    }
  } catch (error) {
    res.status(500).json({ error: "Error copying files." });
  }
});

// Stop copying process
app.post("/stop-copy", (req, res) => {
  isCopying = false; // Set the flag to false to stop copying
  res.json({ message: "Copying process stopped." });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
