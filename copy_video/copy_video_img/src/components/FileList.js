import React from "react";

const FileList = ({ files, fetchFiles }) => {
  return (
    <div className="mb-4">
      <h4>File List</h4>
      <button className="btn btn-primary mb-3" onClick={fetchFiles}>
        Fetch Files
      </button>
      <ul className="list-group">
        {files.map((file, index) => (
          <li key={index} className="list-group-item">
            {file}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
