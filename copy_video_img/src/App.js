import React from "react";
import useFileCopyManager from "./components/FileCopyManager";
import PathSelector from "./components/PathSelector";
import FileList from "./components/FileList";
import ProgressCircle from "./components/ProgressCircle";
import ControlButtons from "./components/ControlButtons";
import LogDisplay from "./components/LogDisplay";
import "./App.css";

const App = () => {
  const {
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
  } = useFileCopyManager();

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">File Copier</h1>

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
