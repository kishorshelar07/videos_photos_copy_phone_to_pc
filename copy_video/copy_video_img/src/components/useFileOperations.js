import { useState } from "react";
import { fetchVideoFiles, copyFiles } from "./fileService";

const useFileOperations = () => {
  const [files, setFiles] = useState([]);
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isCopying, setIsCopying] = useState(false);

  const loadFiles = async (sourcePath) => {
    try {
      const videoFiles = await fetchVideoFiles(sourcePath);
      setFiles(videoFiles);
    } catch (error) {
      setLogs((prevLogs) => [...prevLogs, "Error fetching files."]);
    }
  };

  const startCopying = async (sourcePath, destinationPath) => {
    setIsCopying(true);
    setLogs((prevLogs) => [...prevLogs, "Starting file copy..."]);

    try {
      const totalFiles = files.length;
      for (let i = 0; i < totalFiles; i++) {
        await copyFiles(sourcePath, destinationPath, [files[i]]);
        setProgress(Math.round(((i + 1) / totalFiles) * 100));
        setLogs((prevLogs) => [...prevLogs, `✔ Copied: ${files[i]}`]);
      }
      setLogs((prevLogs) => [...prevLogs, "✅ All files copied successfully!"]);
    } catch (error) {
      setLogs((prevLogs) => [...prevLogs, "❌ Error during file copy."]);
    } finally {
      setIsCopying(false);
    }
  };

  return { files, logs, progress, isCopying, loadFiles, startCopying };
};

export default useFileOperations;
