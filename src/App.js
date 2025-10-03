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
import BackToTopButton from './components/BackToTopButton';
import { db } from './Firebase';
import { collection, getDocs, doc, writeBatch, query, where, getDoc } from 'firebase/firestore';

/**
 * The main application component responsible for rendering the chore tracker UI.
 *
 * This file has been updated to remove the legacy "Kevin" user from the default
 * colour map and to streamline the styling configuration for the app. The
 * `userStyles` object now only includes entries for Will and Kristyn. These
 * colours are defined using modern CSS variables in `App.css` and can be
 * customised further by editing that file.
 */
function App() {
  const users = useFetchUsers();

  // ***** NOTE ***** //
  // The userStyles object below is used to set the background colour of the
  // cells in the DailyChores, WeeklyChores, and HiScores components. In the
  // database the name of the id for userScores is the same as the name of
  // the user. This is the only ID field in which you must use a specific
  // name. All other ID fields can be auto‑generated or whatever you'd like
  // without issue. If you'd like to change the name of the id field in
  // userScores, you must also update the userStyles object below to match
  // the new name.
  // ***** NOTE ***** //

  const userStyles = {
    // Default styles: map the user's document name to a background colour.
    // Will's favourite colour is green and Kristyn's favourite colour is pink.
    'Will': { backgroundColor: '#90ee90' },
    'Kristyn': { backgroundColor: '#ffb6c1' }
  };

  const [refreshScores, setRefreshScores] = useState(false);

  const handleScoresUpdated = () => {
    setRefreshScores(prev => !prev);
  };

  const calculateAndResetScores = async () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    let scores = users.reduce((acc, user) => {
      acc[user] = 0; // Initialize score for each user
      return acc;
    }, {});

    const batch = writeBatch(db);

    // Reset daily chores and calculate scores
    const dailyChoresSnapshot = await getDocs(collection(db, 'dailyChores'));
    for (const docSnap of dailyChoresSnapshot.docs) {
      const docUpdate = {};
      Object.keys(docSnap.data().days).forEach(day => {
        docUpdate[`days.${day}.completedBy`] = 'null'; // Reset completion status
        const completedBy = docSnap.data().days[day]?.completedBy;
        if (completedBy && scores.hasOwnProperty(completedBy)) {
          scores[completedBy] += 1; // Increment score
        }
      });
      batch.update(docSnap.ref, docUpdate);
    }

    // Reset weekly chores and calculate scores
    const weeklyChoresSnapshot = await getDocs(collection(db, 'weeklyChores'));
    for (const docSnap of weeklyChoresSnapshot.docs) {
      const completedBy = docSnap.data().completedBy;
      if (completedBy && scores.hasOwnProperty(completedBy)) {
        scores[completedBy] += 2; // 2 points per weekly chore
      }
      batch.update(docSnap.ref, { completedBy: 'null' }); // Reset status
    }

    // Calculate scores for monthly chores completed within the last week
    const monthlyChoresSnapshot = await getDocs(query(collection(db, 'monthlyChores'), where('completedDate', '>=', oneWeekAgo)));
    for (const docSnap of monthlyChoresSnapshot.docs) {
      const completedBy = docSnap.data().completedBy;
      if (completedBy && scores.hasOwnProperty(completedBy)) {
        scores[completedBy] += 3; // 3 points per monthly chore
      }
      // Monthly chores are not reset; they persist so we can track the last completion date
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

    // Commit the batch after all updates
    try {
      await batch.commit();
      console.log('Batch commit successful, refreshing page...');
      window.location.reload();
    } catch (error) {
      console.error('Failed to commit batch or refresh page:', error);
    }
  };

  return (
    <UserStylesContext.Provider value={userStyles}>
      <div className="App">
        <header className="App-header">
          <h1>Chore Tracker</h1>
          <ChoreTracker />
        </header>
        <div className="DailyChores">
          <DailyChores users={users} />
        </div>
        <div className="WeeklyChores">
          <WeeklyChores users={users} />
        </div>
        <div className="MonthlyChores">
          <MonthlyChores users={users} />
        </div>
        <NewWeekButton onNewWeek={calculateAndResetScores} />
        <div className="HiScores">
          <HiScores refreshTrigger={refreshScores} users={users} />
        </div>
        <BackToTopButton />
      </div>
    </UserStylesContext.Provider>
  );
}

export default App;