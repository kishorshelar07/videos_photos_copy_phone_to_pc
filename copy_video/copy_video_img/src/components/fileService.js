import axios from "axios";

// Function to fetch video files from a source path
export const fetchVideoFiles = async (sourcePath) => {
  try {
    const response = await axios.get(`/api/files`, { params: { path: sourcePath } });
    return response.data; // Return list of video files
  } catch (error) {
    console.error("Error fetching video files:", error);
    throw error;
  }
};

// Function to copy video files
export const copyFiles = async (sourcePath, destinationPath, files) => {
  try {
    for (let file of files) {
      // Simulate a copy operation
      console.log(`Copying ${file} from ${sourcePath} to ${destinationPath}`);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay
    }
    return "Copy complete!";
  } catch (error) {
    console.error("Error copying files:", error);
    throw error;
  }
};
