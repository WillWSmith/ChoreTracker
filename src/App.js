import React, { useState } from 'react';
import './App.css';
import ChoreTracker from './components/ChoreTracker';
import DailyChores from './components/DailyChores';
import WeeklyChores from './components/WeeklyChores';
import MonthlyChores from './components/MonthlyChores';
import HiScores from './components/HiScores';
import NewWeekButton from './components/NewWeekButton';
import { db } from './Firebase';
import { collection, getDocs, updateDoc, doc, writeBatch, query, where, increment, getDoc } from 'firebase/firestore';

function App() {
  const [refreshScores, setRefreshScores] = useState(false);

  const handleScoresUpdated = () => {
    setRefreshScores(prev => !prev);
  };

  const calculateAndResetScores = async () => {
    let willScore = 0;
    let kristynScore = 0;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
    // Reset daily chores
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
  
    // Reset weekly chores
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
  
    // Fetch current scores from the database
    const willUserDoc = await getDoc(willUserRef);
    const kristynUserDoc = await getDoc(kristynUserRef);
  
    // Assume the document structure contains fields lastWeekScores and allTimeHighScores
    const willCurrentHighScore = willUserDoc.exists() ? willUserDoc.data().allTimeHighScores : 0;
    const kristynCurrentHighScore = kristynUserDoc.exists() ? kristynUserDoc.data().allTimeHighScores : 0;
  
    // Compare and potentially update All-Time High Scores
    const newWillHighScore = Math.max(willScore, willCurrentHighScore);
    const newKristynHighScore = Math.max(kristynScore, kristynCurrentHighScore);
  
    // Update last week's scores and All-Time High Scores if last week's scores are higher
    if (willScore > willCurrentHighScore) {
      batch.update(willUserRef, {
        lastWeekScores: willScore,
        allTimeHighScores: newWillHighScore
      });
    }
  
    if (kristynScore > kristynCurrentHighScore) {
      batch.update(kristynUserRef, {
        lastWeekScores: kristynScore,
        allTimeHighScores: newKristynHighScore
      });
    }
  
    // Commit the batch
    await batch.commit();
    handleScoresUpdated();
    window.location.reload();
  };  
  
  return (
    <div className="App">
      <header className="App-header">
        <ChoreTracker />
      </header>
      <div className="DailyChores">
        <DailyChores />
      </div>
      <div className="WeeklyChores">
        <WeeklyChores />
      </div>
      <div className="MonthlyChores">
        <MonthlyChores />
      </div>
      <NewWeekButton onNewWeek={calculateAndResetScores} />
      <div className="HiScores">
        <HiScores refreshTrigger={refreshScores} />
      </div>
    </div>
  );
}

export default App;
