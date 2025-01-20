import React, { useState } from "react";

const ControlButtons = ({ startCopying, stopCopying }) => {
  const [isCopying, setIsCopying] = useState(false);

  const handleStart = () => {
    setIsCopying(true);
    startCopying();
  };

  const handleStop = () => {
    setIsCopying(false);
    stopCopying();
  };

  return (
    <div className="d-flex justify-content-center mt-4">
      {!isCopying ? (
        <button className="btn btn-success btn-lg me-2" onClick={handleStart}>
          Start Copying
        </button>
      ) : (
        <button className="btn btn-danger btn-lg me-2" onClick={handleStop}>
          Stop Copying 
        </button>
      )}
    </div>
  );
};

export default ControlButtons;
