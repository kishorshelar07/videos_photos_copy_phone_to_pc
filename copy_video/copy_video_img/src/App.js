import React, { useState } from "react";
import PathSelector from "./components/PathSelector";
import FileList from "./components/FileList";
import ProgressBar from "./components/ProgressBar";
import ControlButtons from "./components/ControlButtons";
import LogDisplay from "./components/LogDisplay";

const App = () => {
  const [sourcePath, setSourcePath] = useState("");
  const [destinationPath, setDestinationPath] = useState("");
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);

  // Fetch files from the source folder (via backend API)
  const fetchFiles = async () => {
    if (!sourcePath) {
      setLogs((prevLogs) => [
        ...prevLogs,
        "❌ Please provide a valid source path.",
      ]);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourcePath }),
      });
      const data = await response.json();
      if (response.ok) {
        setFiles(data.files);
        setLogs((prevLogs) => [...prevLogs, "📂 Files fetched successfully!"]);
      } else {
        setLogs((prevLogs) => [...prevLogs, `❌ ${data.error}`]);
      }
    } catch (error) {
      setLogs((prevLogs) => [...prevLogs, `❌ Error fetching files: ${error}`]);
    }
  };

  // Start copying files (via backend API)
  const startCopying = async () => {
    if (!sourcePath || !destinationPath) {
      setLogs((prevLogs) => [
        ...prevLogs,
        "❌ Please set both source and destination paths.",
      ]);
      return;
    }

    setLogs((prevLogs) => [...prevLogs, "📂 Starting file copy process..."]);
    try {
      const response = await fetch("http://localhost:5000/copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourcePath, destinationPath }),
      });
      const data = await response.json();

      if (response.ok) {
        setLogs((prevLogs) => [...prevLogs, "✅ File copy process completed!"]);
        setFiles([]);
        setProgress(100);
      } else {
        setLogs((prevLogs) => [...prevLogs, `❌ ${data.error}`]);
      }
    } catch (error) {
      setLogs((prevLogs) => [...prevLogs, `❌ Error copying files: ${error}`]);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center">Real Video File Copier</h1>
      <PathSelector
        sourcePath={sourcePath}
        setSourcePath={setSourcePath}
        destinationPath={destinationPath}
        setDestinationPath={setDestinationPath}
      />
      <FileList files={files} fetchFiles={fetchFiles} />
      <ProgressBar progress={progress} />
      <ControlButtons startCopying={startCopying} />
      <LogDisplay logs={logs} />
    </div>
  );
};

export default App;
