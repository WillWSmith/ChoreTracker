import React, { useState, useEffect } from 'react';
import { db } from '../Firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DailyChores = () => {
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
    const currentStatus = chore.days[day]?.completedBy;
    let nextStatus;
  
    switch (currentStatus) {
      case 'null':
        nextStatus = 'Will';
        break;
      case 'Will':
        nextStatus = 'Kristyn';
        break;
      case 'Kristyn':
        nextStatus = 'null';
        break;
      default:
        break;
    }
  
    try {
      // Update database
      const choreRef = doc(db, 'dailyChores', choreId);
      await updateDoc(choreRef, {
        [`days.${day}.completedBy`]: nextStatus,
      });
  
      // After successful update, refetch data to ensure UI is in sync
      await fetchData();
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <div>
      <h2>Daily Chores</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            {daysOfWeek.map(day => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {chores.map(chore => (
            <tr key={chore.id}>
              <td>{chore.name}</td>
              {daysOfWeek.map(day => {
  const completedBy = chore.days[day]?.completedBy;
  let cellClass = 'chore-cell';
  if (completedBy === 'Will') {
    cellClass += ' chore-cell-will';
  } else if (completedBy === 'Kristyn') {
    cellClass += ' chore-cell-kristyn';
  }

  return (
    <td className={cellClass}
        key={day}
        onClick={() => updateChoreStatus(chore.id, day)}
    >
      <span className="cell-initial">
        {completedBy === 'Will' ? 'W' : completedBy === 'Kristyn' ? 'K' : ''}
      </span>
    </td>
  );
})}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DailyChores;