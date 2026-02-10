import React, { useState, useEffect, useContext } from 'react';
import { db } from '../Firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import UserStylesContext from '../contexts/UserStylesContext';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DailyChores = ({ users }) => {
  const [chores, setChores] = useState([]);

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'dailyChores'));
      const choresData = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      setChores(choresData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateChoreStatus = async (choreId, day) => {
    const chore = chores.find(c => c.id === choreId);
    const currentStatus = chore.days[day]?.completedBy || 'null';
    const currentUserIndex = currentStatus === 'null' ? -1 : users.indexOf(currentStatus);
    const nextUserIndex = (currentUserIndex + 1) % (users.length + 1);
    const nextUser = nextUserIndex < users.length ? users[nextUserIndex] : 'null';
  
    try {
      const choreRef = doc(db, 'dailyChores', choreId);
      await updateDoc(choreRef, {
        [`days.${day}.completedBy`]: nextUser,
      });
      await fetchData();
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const userStyles = useContext(UserStylesContext);

  const getStyleForUser = (userName) => {
    return userName ? userStyles[userName] || {} : {};
  };

  return (
    <div className="module">
      <div className="module-header">
        <h2>Daily Rituals</h2>
        <p className="module-description">Track your daily victories across the week</p>
      </div>
      <div className="table-scroller">
        <table>
          <thead>
            <tr>
              <th></th>
              {daysOfWeek.map(day => (
                <th key={day}>{day.slice(0, 3)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chores.map(chore => (
              <tr key={chore.id}>
                <td className="chore-name">{chore.name}</td>
                {daysOfWeek.map(day => {
                  const completedBy = chore.days[day]?.completedBy;
                  const userInitial = users.includes(completedBy) ? completedBy.charAt(0) : '';
                  return (
                    <td 
                      style={getStyleForUser(chore.days[day]?.completedBy)} 
                      className="chore-cell"
                      key={day}
                      onClick={() => updateChoreStatus(chore.id, day)}
                    >
                      <span className="cell-initial">{userInitial}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyChores;
