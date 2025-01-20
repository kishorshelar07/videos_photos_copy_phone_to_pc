import { useState } from "react";

const useFileCopyManager = () => {
  const [sourcePath, setSourcePath] = useState("");
  const [destinationPath, setDestinationPath] = useState("");
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [copying, setCopying] = useState(false);
  const [eventSource, setEventSource] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const fetchFiles = async () => {
    if (!sourcePath) {
      setLogs((prevLogs) => [...prevLogs, "❌ Please provide a valid source path."]);
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
        setAlertMessage("📂 Files fetched successfully!");
        setAlertType("alert-success");
      } else {
        setLogs((prevLogs) => [...prevLogs, `❌ ${data.error}`]);
        setAlertMessage(`❌ ${data.error}`);
        setAlertType("alert-danger");
      }

      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        setAlertMessage("");
        setAlertType("");
      }, 3000);
    } catch (error) {
      setLogs((prevLogs) => [...prevLogs, `❌ Error fetching files: ${error}`]);
      setAlertMessage(`❌ Error fetching files: ${error}`);
      setAlertType("alert-danger");

      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        setAlertMessage("");
        setAlertType("");
      }, 3000);
    }
  };

  const startCopying = () => {
    if (!sourcePath || !destinationPath) {
      setLogs((prevLogs) => [...prevLogs, "❌ Please set both source and destination paths."]);
      return;
    }

    setLogs((prevLogs) => [...prevLogs, "📂 Starting file copy process..."]);
    setProgress(0);
    setCopying(true);

    const newEventSource = new EventSource(
      `http://localhost:5000/copy?sourcePath=${encodeURIComponent(sourcePath)}&destinationPath=${encodeURIComponent(destinationPath)}`
    );

    newEventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setProgress(data.progress);
      if (data.progress === 100) {
        newEventSource.close();
        setCopying(false);
        setLogs((prevLogs) => [...prevLogs, "✅ File copying completed successfully!"]);
      }
    };

    newEventSource.onerror = () => {
      setLogs((prevLogs) => [...prevLogs, "❌ Error receiving progress updates."]);
      newEventSource.close();
      setCopying(false);
    };

    setEventSource(newEventSource);
  };

  const stopCopying = async () => {
    try {
      const response = await fetch("http://localhost:5000/stop-copy", {
        method: "POST",
      });
      const data = await response.json();

      if (response.ok) {
        setLogs((prevLogs) => [...prevLogs, "⛔ Copying process stopped successfully!"]);
      } else {
        setLogs((prevLogs) => [...prevLogs, `❌ Failed to stop copying: ${data.error}`]);
      }

      setCopying(false);
      if (eventSource) {
        eventSource.close();
      }
    } catch (error) {
      setLogs((prevLogs) => [...prevLogs, `❌ Error stopping copying: ${error}`]);
    }
  };

  return {
    sourcePath,
    setSourcePath,
    destinationPath,
    setDestinationPath,
    files,
    fetchFiles,
    progress,
    logs,
    copying,
    startCopying,
    stopCopying,
    alertMessage,
    alertType,
    showAlert,
    setShowAlert,
  };
};

export default useFileCopyManager;
