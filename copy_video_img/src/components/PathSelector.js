import React from "react";

const PathSelector = ({ sourcePath, setSourcePath, destinationPath, setDestinationPath }) => {
  return (
    <div className="mb-4">
      <div className="form-group">
        <label htmlFor="sourcePath">Source Path</label>
        <input
          type="text"
          className="form-control"
          id="sourcePath"
          value={sourcePath}
          onChange={(e) => setSourcePath(e.target.value)}
          placeholder="Enter source path"
        />
      </div>
      <div className="form-group">
        <label htmlFor="destinationPath">Destination Path</label>
        <input
          type="text"
          className="form-control"
          id="destinationPath"
          value={destinationPath}
          onChange={(e) => setDestinationPath(e.target.value)}
          placeholder="Enter destination path"
        />
      </div>
    </div>
  );
};

export default PathSelector;
