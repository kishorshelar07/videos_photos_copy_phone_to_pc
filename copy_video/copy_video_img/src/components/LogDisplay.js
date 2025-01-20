import React from "react";

const LogDisplay = ({ logs }) => {
  return (
    <div className="card p-3">
      <h5 className="card-title">Logs</h5>
      <div className="log-container" style={{ maxHeight: "250px", overflowY: "auto" }}>
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
