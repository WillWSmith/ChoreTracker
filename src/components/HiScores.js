import React, { useState, useEffect, useContext } from 'react';
import { db } from '../Firebase';
import { collection, getDocs } from 'firebase/firestore';
import UserStylesContext from '../contexts/UserStylesContext';

const HiScores = ({ refreshTrigger }) => {
  const [scores, setScores] = useState({});
  const userStyles = useContext(UserStylesContext);

  useEffect(() => {
    const fetchScores = async () => {
      const scoresSnapshot = await getDocs(collection(db, 'userScores'));
      const newScores = {};
      scoresSnapshot.forEach((doc) => {
        newScores[doc.id] = doc.data();
      });
      setScores(newScores);
    };

    fetchScores();
  }, [refreshTrigger]);

  return (
    <div className="scoreboard">
      <div className="scoreboard-header">
        <span className="scoreboard-eyebrow">Competitive Spark</span>
        <h2>Legacy Scoreboard</h2>
        <p className="scoreboard-description">Celebrate the latest MVPs and salute the reigning champions.</p>
      </div>
      <div className="scoreboard-grid">
        {Object.keys(scores).map(userName => {
          const accentStyle = userStyles[userName] || {};
          return (
            <div className="score-card" key={userName}>
              <div className="score-card-header" style={accentStyle}>
                <span className="score-avatar">{userName.charAt(0)}</span>
                <h3>{userName}</h3>
              </div>
              <div className="score-metrics">
                <div className="metric">
                  <span className="metric-label">Last Week</span>
                  <span className="metric-value">{scores[userName].lastWeekScores}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">All Time</span>
                  <span className="metric-value">{scores[userName].allTimeHighScores}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HiScores;

