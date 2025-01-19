import React from "react";

const ControlButtons = ({ startCopying }) => {
  return (
    <div className="mb-4 text-center">
      <button className="btn btn-success me-2" onClick={startCopying}>
        Start Copying
      </button>
    </div>
  );
};

export default ControlButtons;
