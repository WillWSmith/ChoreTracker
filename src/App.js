import React, { useState } from 'react';
import { useFetchUsers } from './hooks/useFetchUsers';
import './App.css';
import UserStylesContext from './contexts/UserStylesContext';
import ChoreTracker from './components/ChoreTracker';
import DailyChores from './components/DailyChores';
import WeeklyChores from './components/WeeklyChores';
import MonthlyChores from './components/MonthlyChores';
import HiScores from './components/HiScores';
import NewWeekButton from './components/NewWeekButton';
import { db } from './Firebase';
import { collection, getDocs, updateDoc, doc, writeBatch, query, where, getDoc } from 'firebase/firestore';

function App() {
  const users = useFetchUsers();

  const userStyles = {
    // Default styles; Match Document name for user in db to set cell colour
    // 'document name': { backgroundColor: 'color' }

    // Default Example:
    'Will': { backgroundColor: '#90ee90' },
    'Kristyn': { backgroundColor: '#ffb6c1' },
    'Kevin': { backgroundColor: '#87ceeb' }
  
  };

  const [refreshScores, setRefreshScores] = useState(false);

  const handleScoresUpdated = () => {
    setRefreshScores(prev => !prev);
  };

  const calculateAndResetScores = async () => {
    let willScore = 0;
    let kristynScore = 0;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
    // Reset daily chores and calculate scores
    const dailyChoresQuery = collection(db, 'dailyChores');
    const dailyChoresSnapshot = await getDocs(dailyChoresQuery);
    dailyChoresSnapshot.forEach((doc) => {
      updateDoc(doc.ref, {
        days: {
          Monday: { completedBy: 'null' },
          Tuesday: { completedBy: 'null' },
          Wednesday: { completedBy: 'null' },
          Thursday: { completedBy: 'null' },
          Friday: { completedBy: 'null' },
          Saturday: { completedBy: 'null' },
          Sunday: { completedBy: 'null' }
        }
      });
      // Increment scores based on completion
      Object.values(doc.data().days).forEach(day => {
        if (day.completedBy === 'Will') willScore += 1;
        if (day.completedBy === 'Kristyn') kristynScore += 1;
      });
    });
  
    // Reset weekly chores and calculate scores
    const weeklyChoresQuery = collection(db, 'weeklyChores');
    const weeklyChoresSnapshot = await getDocs(weeklyChoresQuery);
    weeklyChoresSnapshot.forEach((doc) => {
      updateDoc(doc.ref, { completedBy: 'null' });
      // Increment scores based on completion
      if (doc.data().completedBy === 'Will') willScore += 2;
      if (doc.data().completedBy === 'Kristyn') kristynScore += 2;
    });
  
    // Calculate scores for monthly chores completed within the last week
    const monthlyChoresQuery = query(collection(db, 'monthlyChores'), where('completedDate', '>=', oneWeekAgo));
    const monthlyChoresSnapshot = await getDocs(monthlyChoresQuery);
    monthlyChoresSnapshot.forEach((doc) => {
      // Increment scores based on completion
      if (doc.data().completedBy === 'Will') willScore += 3;
      if (doc.data().completedBy === 'Kristyn') kristynScore += 3;
    });
  
    // Update user scores in the database
    const batch = writeBatch(db);
  
    const willUserRef = doc(db, 'userScores', 'Will');
    const kristynUserRef = doc(db, 'userScores', 'Kristyn');
  
    // Update last week's scores directly without adding to the previous scores
    const newWillLastWeekScores = willScore;
    const newKristynLastWeekScores = kristynScore;

    // Fetch current scores from the database to get the allTimeHighScores
    const willUserDoc = await getDoc(willUserRef);
    const kristynUserDoc = await getDoc(kristynUserRef);

    // Update last week scores in the database
    batch.update(willUserRef, { lastWeekScores: newWillLastWeekScores });
    batch.update(kristynUserRef, { lastWeekScores: newKristynLastWeekScores });
    
    // Compare with high scores and update if necessary
    const willHighScore = willUserDoc.exists() ? willUserDoc.data().allTimeHighScores || 0 : 0;
    const kristynHighScore = kristynUserDoc.exists() ? kristynUserDoc.data().allTimeHighScores || 0 : 0;

    if (newWillLastWeekScores > willHighScore) {
      batch.update(willUserRef, { allTimeHighScores: newWillLastWeekScores });
    }

  if (newKristynLastWeekScores > kristynHighScore) {
    batch.update(kristynUserRef, { allTimeHighScores: newKristynLastWeekScores });
  }

    // Commit the batch
    await batch.commit();
    handleScoresUpdated();
    window.location.reload();
  };  
  
  return (
    <UserStylesContext.Provider value={userStyles}>
    <div className="App">
      <header className="App-header">
        <ChoreTracker />
      </header>
      <div className="DailyChores">
        <DailyChores users={users}/>
      </div>
      <div className="WeeklyChores">
        <WeeklyChores users={users}/>
      </div>
      <div className="MonthlyChores">
        <MonthlyChores users={users}/>
      </div>
      <NewWeekButton onNewWeek={calculateAndResetScores} />
      <div className="HiScores">
        <HiScores refreshTrigger={refreshScores} users={users}/>
      </div>
    </div>
    </UserStylesContext.Provider>
  );
}

export default App;
