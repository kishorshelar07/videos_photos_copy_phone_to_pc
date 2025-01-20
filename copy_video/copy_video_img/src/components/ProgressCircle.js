import React from "react";

const ProgressCircle = ({ progress }) => {
  const roundedProgress = Math.round(progress);

  return (
    <div className="d-flex justify-content-center mb-4">
      <div className="progress-circle-container" style={{ position: "relative", display: "inline-block" }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="50"
            stroke="lightgray"
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx="60"
            cy="60"
            r="50"
            stroke="#4caf50"
            strokeWidth="10"
            fill="none"
            strokeDasharray="314"
            strokeDashoffset={314 - (roundedProgress / 100) * 314}
            style={{ transition: "stroke-dashoffset 0.5s" }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            top: "35%",
            left: "35%",
            fontSize: "20px",
            fontWeight: "bold",
            color: "#4caf50",
          }}
        >
          {roundedProgress}%
        </div>
      </div>
    </div>
  );
};

export default ProgressCircle;
