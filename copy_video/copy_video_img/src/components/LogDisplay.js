import React from "react";

const LogDisplay = ({ logs }) => {
  return (
    <div className="mb-4">
      <h4>Logs</h4>
      <div className="log-container" style={{ maxHeight: "200px", overflowY: "auto" }}>
        <ul className="list-group">
          {logs.map((log, index) => (
            <li key={index} className="list-group-item">
              {log}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LogDisplay;
