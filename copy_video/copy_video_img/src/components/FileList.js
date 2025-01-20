import React from "react";

const FileList = ({ files, fetchFiles }) => {
  return (
    <div className="card p-3 mb-3">
      <h5 className="card-title">File List</h5>
      <button className="btn btn-primary mb-2" onClick={fetchFiles}>
        Fetch Files
      </button>
      <p>Total files: {files.length}</p>
    </div>
  );
};

export default FileList;
