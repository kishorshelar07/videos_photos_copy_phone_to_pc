// Import necessary modules for file system operations
const fs = require("fs");
const path = require("path");
const fse = require("fs-extra");

// Update these paths based on your system
// Define the path to your phone's storage (mapped drive or folder in your system)
const PHONE_STORAGE_PATH = "D:\\desktop\\folder name";  // Change to your phone's storage path
// Define the destination folder where videos will be copied on your PC
const DESTINATION_FOLDER = "D:\\videos\\copy videos";  // Change to your PC folder

// Ensure the destination folder exists. If it doesn't, create it
if (!fs.existsSync(DESTINATION_FOLDER)) {
    fs.mkdirSync(DESTINATION_FOLDER, { recursive: true });  // Create folder if not exists
}

// Function to copy videos in batches of 50
async function copyVideosInBatches() {
    // Infinite loop to keep checking for and copying videos until all are copied
    while (true) {  
        try {
            // Read all video files from the phone storage
            let files = fs.readdirSync(PHONE_STORAGE_PATH)  // Get all files in the source folder
                          .filter(file => file.endsWith(".mp4") || file.endsWith(".mov"))  // Filter only video files (mp4, mov)
                          .filter(file => !fs.existsSync(path.join(DESTINATION_FOLDER, file)))  // Skip already copied files
                          .slice(0, 50);  // Limit to 50 files at a time

            // If there are no more files to copy, exit the loop
            if (files.length === 0) {
                console.log("✅ All videos have been copied successfully!");
                break; // Exit loop when no more videos are left
            }

            // Log how many files are being copied
            console.log(`📂 Copying ${files.length} videos...`);

            // Loop through each file and copy it
            for (let file of files) {
                // Construct the full path of the source file
                let sourcePath = path.join(PHONE_STORAGE_PATH, file);
                // Construct the full path of the destination file
                let destinationPath = path.join(DESTINATION_FOLDER, file);

                // Use fs-extra's copy method to copy the file
                await fse.copy(sourcePath, destinationPath);
                // Log the success of the file copy
                console.log(`✔ Copied: ${file}`);
            }

            // Wait for 5 seconds before checking for more files to prevent excessive resource usage
            console.log("⏳ Waiting 5 seconds before checking for more files...");
            await new Promise(resolve => setTimeout(resolve, 5000)); // Delay to prevent excessive resource usage
        } catch (error) {
            // If there's an error, log it and break out of the loop
            console.error("❌ Error copying files:", error);
            break; // Exit loop on error
        }
    }
}

// Run the script to start the copy process
copyVideosInBatches();
