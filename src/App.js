import React, { useState } from 'react';
import { useFetchUsers } from './hooks/useFetchUsers';
import './App.css';
import UserStylesContext from './contexts/UserStylesContext';
import DailyChores from './components/DailyChores';
import WeeklyChores from './components/WeeklyChores';
import MonthlyChores from './components/MonthlyChores';
import HiScores from './components/HiScores';
import NewWeekButton from './components/NewWeekButton';
import BackToTopButton from './components/BackToTopButton';
import { db } from './Firebase';
import { collection, getDocs, doc, writeBatch, query, where, getDoc } from 'firebase/firestore';

function App() {
  const users = useFetchUsers();
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('userTheme') || 'will';
  });

  // User color styles for table cells
  const userStyles = {
    'Will': { backgroundColor: '#90ee90' },
    'Kristyn': { backgroundColor: '#ffb6c1' },
    'Kevin': { backgroundColor: '#87ceeb' }
  };

  const [refreshScores, setRefreshScores] = useState(false);

  // Toggle between Will and Kristyn themes
  const toggleTheme = (theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('userTheme', theme);
    document.body.setAttribute('data-theme', theme);
  };

  React.useEffect(() => {
    document.body.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  const calculateAndResetScores = async () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
    let scores = users.reduce((acc, user) => {
      acc[user] = 0;
      return acc;
    }, {});
  
    const batch = writeBatch(db);
  
    // Reset daily chores and calculate scores
    const dailyChoresSnapshot = await getDocs(collection(db, 'dailyChores'));
    for (const doc of dailyChoresSnapshot.docs) {
      const docUpdate = {};
      Object.keys(doc.data().days).forEach(day => {
        docUpdate[`days.${day}.completedBy`] = 'null';
        const completedBy = doc.data().days[day]?.completedBy;
        if (completedBy && scores.hasOwnProperty(completedBy)) {
          scores[completedBy] += 1;
        }
      });
      batch.update(doc.ref, docUpdate);
    }
  
    // Reset weekly chores and calculate scores
    const weeklyChoresSnapshot = await getDocs(collection(db, 'weeklyChores'));
    for (const doc of weeklyChoresSnapshot.docs) {
      const completedBy = doc.data().completedBy;
      if (completedBy && scores.hasOwnProperty(completedBy)) {
        scores[completedBy] += 2;
      }
      batch.update(doc.ref, { completedBy: 'null' });
    }
  
    // Calculate scores for monthly chores completed within the last week
    const monthlyChoresSnapshot = await getDocs(query(collection(db, 'monthlyChores'), where('completedDate', '>=', oneWeekAgo)));
    for (const doc of monthlyChoresSnapshot.docs) {
      const completedBy = doc.data().completedBy;
      if (completedBy && scores.hasOwnProperty(completedBy)) {
        scores[completedBy] += 3;
      }
    }
  
    // Prepare updates for user scores in the database
    for (const user of Object.keys(scores)) {
      const userRef = doc(db, 'userScores', user);
      const userDoc = await getDoc(userRef);
      const lastWeekScores = scores[user];
      const allTimeHighScores = userDoc.exists() && userDoc.data().allTimeHighScores > lastWeekScores 
                                ? userDoc.data().allTimeHighScores 
                                : lastWeekScores;
  
      batch.update(userRef, { lastWeekScores, allTimeHighScores });
    }
  
    try {
      await batch.commit();
      setRefreshScores(prev => !prev);
      console.log('Batch commit successful, refreshing page...');
      window.location.reload();
    } catch (error) {
      console.error("Failed to commit batch or refresh page:", error);
    }
  };
  
  return (
    <UserStylesContext.Provider value={userStyles}>
      <div className="app-container">
        <div className="app-header">
          <div>
            <h1 className="app-title">Chore Constellation</h1>
            <p className="app-subtitle">
              {currentTheme === 'will' 
                ? 'Stay consistent. Earn points. Dominate chores.' 
                : 'Track your tasks with elegance and grace ✨'}
            </p>
          </div>
          
          <div className="theme-controls">
            <button 
              className={`theme-toggle-btn ${currentTheme === 'will' ? 'active' : ''}`}
              onClick={() => toggleTheme('will')}
            >
              Will's View
            </button>
            <button 
              className={`theme-toggle-btn ${currentTheme === 'kristyn' ? 'active' : ''}`}
              onClick={() => toggleTheme('kristyn')}
            >
              Kristyn's View
            </button>
          </div>
        </div>

        <main style={{ marginTop: '1.5rem' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem'
            }}
          >
            <section className="card">
              <DailyChores users={users} />
            </section>

            <section className="card">
              <WeeklyChores users={users} />
            </section>

            <section className="card">
              <MonthlyChores users={users} />
            </section>
          </div>
        </main>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <NewWeekButton onNewWeek={calculateAndResetScores} />
        </div>

        <section className="card" style={{ marginTop: '1.5rem' }}>
          <HiScores refreshTrigger={refreshScores} users={users} />
        </section>

        <BackToTopButton />
      </div>
    </UserStylesContext.Provider>
  );
}

export default App;
