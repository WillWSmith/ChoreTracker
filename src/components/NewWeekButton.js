import React from 'react';

const NewWeekButton = ({ onNewWeek }) => {
  return (
    <button type="button" className="NewWeekButton" onClick={onNewWeek}>
      <span className="button-glow" aria-hidden="true"></span>
      Launch New Week
    </button>
  );
};

export default NewWeekButton;