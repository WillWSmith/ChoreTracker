import React, { useState, useEffect } from 'react';
import { db } from '../Firebase'
import { collection, getDocs } from 'firebase/firestore';
import { doc, updateDoc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

const MonthlyChores = () => {
  const [chores, setChores] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'monthlyChores'));
      const choresData = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        completedDate: doc.data().completedDate ? new Date(doc.data().completedDate.toDate()) : null
      }));
      setChores(choresData);
    };

    fetchData();
  }, []);

  const updateChoreStatus = async (choreId) => {
    const chore = chores.find(c => c.id === choreId);
    const currentStatus = chore.completedBy;
    let nextStatus;
    let updateData = {};
  
    switch (currentStatus) {
      case 'null':
        nextStatus = 'Will';
        updateData = {
          completedBy: nextStatus,
          completedDate: Timestamp.fromDate(new Date()),
        };
        break;
      case 'Will':
        nextStatus = 'Kristyn';
        updateData = {
          completedBy: nextStatus,
        };
        break;
      case 'Kristyn':
        nextStatus = 'null';
        updateData = {
          completedBy: nextStatus,
        };
        break;
      default:
        nextStatus = 'null';
        updateData = { completedBy: nextStatus };
        break;
    }
  
    try {
      // Update local state
      setChores(prevChores => prevChores.map(c =>
        c.id === choreId ? { ...c, ...updateData } : c
      ));
  
      // Update database
      const choreRef = doc(db, 'monthlyChores', choreId);
      await updateDoc(choreRef, updateData);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const formatDate = (date) => {
    if (date && typeof date.toDate === 'function') {
      return date.toDate().toLocaleDateString();
    } else if (date instanceof Date) {
      return date.toLocaleDateString();
    }
    return '';
  };
  

  return (
    <div>
      <h2>Monthly Chores</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Completed By</th>
            <th>Completed Date</th>
          </tr>
        </thead>
        <tbody>
          {chores.map(chore => (
            <tr key={chore.id}>
              <td>{chore.name}</td>
              <td className={`chore-cell ${
                chore.completedBy === 'Will' ? 'chore-cell-will' : 
                chore.completedBy === 'Kristyn' ? 'chore-cell-kristyn' : ''
              }`}
              onClick={() => updateChoreStatus(chore.id)}>
                <span className="cell-initial">
                  {chore.completedBy === 'Will' ? 'W' : chore.completedBy === 'Kristyn' ? 'K' : ''}
                </span>
              </td>
              <td>
                {chore.completedBy ? formatDate(chore.completedDate) : ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MonthlyChores;