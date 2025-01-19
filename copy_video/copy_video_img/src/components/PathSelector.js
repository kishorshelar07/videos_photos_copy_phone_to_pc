import React from "react";

const PathSelector = ({ sourcePath, setSourcePath, destinationPath, setDestinationPath }) => {
  return (
    <div className="mb-4">
      <div className="form-group">
        <label>Source Path:</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter source path"
          value={sourcePath}
          onChange={(e) => setSourcePath(e.target.value)}
        />
      </div>
      <div className="form-group mt-3">
        <label>Destination Path:</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter destination path"
          value={destinationPath}
          onChange={(e) => setDestinationPath(e.target.value)}
        />
      </div>
    </div>
  );
};

export default PathSelector;
