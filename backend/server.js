const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const fse = require("fs-extra");
const cors = require("cors");

const app = express();
const PORT = 5000;

let isCopying = false; // Flag to control the copying process
let stopRequestPending = false; // Prevent duplicate stop requests

app.use(bodyParser.json());
app.use(cors());

// Fetch files from source path
app.post("/files", (req, res) => {
    const { sourcePath } = req.body;

    if (!sourcePath || !fs.existsSync(sourcePath)) {
        return res.status(400).json({ error: "Invalid source path." });
    }

    try {
        const files = fs
            .readdirSync(sourcePath)
            .filter((file) => file.endsWith(".mp4") || file.endsWith(".mov"));

        res.json({ files });
    } catch (error) {
        res.status(500).json({ error: "Error reading files." });
    }
});

// Copy files in batches
app.get("/copy", async (req, res) => {
    const { sourcePath, destinationPath } = req.query;

    if (!sourcePath || !destinationPath) {
        return res.status(400).json({ error: "Invalid paths provided." });
    }

    try {
        const files = fs
            .readdirSync(sourcePath)
            .filter((file) => file.endsWith(".mp4") || file.endsWith(".mov"));

        const batchSize = 50;
        let totalFiles = files.length;
        let copiedFiles = 0;

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        isCopying = true;

        for (let i = 0; i < files.length && isCopying; i += batchSize) {
            const currentBatch = files.slice(i, i + batchSize);

            for (let file of currentBatch) {
                if (!isCopying) {
                    res.write(`data: { "progress": 0, "message": "Copy stopped" }\n\n`);
                    res.end();
                    return;
                }

                const src = path.join(sourcePath, file);
                const dest = path.join(destinationPath, file);

                try {
                    await fse.copy(src, dest);
                    copiedFiles++;
                    res.write(`data: { "progress": ${(copiedFiles / totalFiles) * 100}, "file": "${file}" }\n\n`);
                } catch (error) {
                    console.error(`Error copying file ${file}:`, error);
                    res.write(`data: { "error": "Failed to copy file: ${file}" }\n\n`);
                }
            }

            await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay for real-time feedback
        }

        if (isCopying) {
            res.write(`data: { "progress": 100, "message": "Copy completed" }\n\n`);
            res.end();
        }
    } catch (error) {
        res.status(500).json({ error: "Error copying files." });
    }
});

// Stop copying process
app.post("/stop-copy", (req, res) => {
    if (!stopRequestPending) {
        stopRequestPending = true;
        isCopying = false;
        setTimeout(() => (stopRequestPending = false), 500);
        res.json({ message: "Copying process stopped." });
    } else {
        res.json({ message: "Stop request already pending." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
