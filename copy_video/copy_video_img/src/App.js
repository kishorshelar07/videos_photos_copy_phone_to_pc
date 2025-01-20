import React, { useState } from "react";
import PathSelector from "./components/PathSelector";
import FileList from "./components/FileList";
import ProgressCircle from "./components/ProgressCircle";
import ControlButtons from "./components/ControlButtons";
import LogDisplay from "./components/LogDisplay";
import "./App.css";

const App = () => {
  const [sourcePath, setSourcePath] = useState("");
  const [destinationPath, setDestinationPath] = useState("");
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [copying, setCopying] = useState(false);
  const [eventSource, setEventSource] = useState(null); // Track the EventSource instance
  const [alertMessage, setAlertMessage] = useState(""); // New state for alert message
  const [alertType, setAlertType] = useState(""); // State for alert type (success or error)
  const [showAlert, setShowAlert] = useState(false); // State for controlling visibility of alert

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
        setAlertMessage("📂 Files fetched successfully!"); // Set success message
        setAlertType("alert-success"); // Success alert type
      } else {
        setLogs((prevLogs) => [...prevLogs, `❌ ${data.error}`]);
        setAlertMessage(`❌ ${data.error}`); // Set error message
        setAlertType("alert-danger"); // Error alert type
      }

      // Show alert and hide it after 3 seconds
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
      setLogs((prevLogs) => [
        ...prevLogs,
        "❌ Please set both source and destination paths.",
      ]);
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

    setEventSource(newEventSource); // Save the EventSource instance
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

      setCopying(false); // Update the UI state
      if (eventSource) {
        eventSource.close(); // Ensure the EventSource connection is closed
      }
    } catch (error) {
      setLogs((prevLogs) => [...prevLogs, `❌ Error stopping copying: ${error}`]);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">File Copier</h1>

      {/* Bootstrap Alert with CSS Effects for File Fetch Message */}
      {showAlert && (
        <div className={`alert ${alertType} show`} role="alert">
          {alertMessage}
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowAlert(false)}
            aria-label="Close"
          ></button>
        </div>
      )}

      <div className="card shadow-lg p-4">
        <PathSelector
          sourcePath={sourcePath}
          setSourcePath={setSourcePath}
          destinationPath={destinationPath}
          setDestinationPath={setDestinationPath}
        />
        <FileList files={files} fetchFiles={fetchFiles} />
        <ProgressCircle progress={progress} />
        <ControlButtons startCopying={startCopying} stopCopying={stopCopying} />
        <LogDisplay logs={logs} />
      </div>
    </div>
  );
};

export default App;
