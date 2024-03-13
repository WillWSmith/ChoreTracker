import React, { useState } from 'react';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const weeklyChores = [
  "Aria's Room", "Aria's Bed", "Daniel's Room", "Daniel's Bed", "Basement",
  "Our Bed", "Living Room", "Bathroom", "Kitchen", "Garbage", "Recycling",
  "Sweep Upstairs", "Sweep Downstairs", "Mop Upstairs", "Mop Basement",
  "Laundry Away", "Bathe Kids", "Mop Main Floor"
];
const monthlyChores = [
  "Litter", "Fridge", "Dust Upstairs", "Dust Downstairs", "Dust Main Floor",
  "Car", "Microwave", "Oven", "Inside Cabinets", "Outside Cabinets",
  "Daniel's Walls", "Aria's Walls", "Upstairs Hall Walls",
  "Living Room Walls", "Kitchen Walls", "Bathroom Walls", "Downstairs Hall Walls",
  "Basement Walls"
];

function ChoreTable() {
  const [completedDailyChores, setCompletedDailyChores] = useState({});
  const [completedWeeklyChores, setCompletedWeeklyChores] = useState({});
  const [completedMonthlyChores, setCompletedMonthlyChores] = useState({});

  const handleDailyChoreClick = (day, chore) => {
    setCompletedDailyChores(prevState => ({
      ...prevState,
      [day]: {
        ...prevState[day],
        [chore]: prevState[day]?.[chore] === 'Will' ? 'Kristyn' : (prevState[day]?.[chore] === 'Kristyn' ? null : 'Will'),
      },
    }));
  };

  const handleWeeklyChoreClick = (chore) => {
    setCompletedWeeklyChores(prevState => ({
      ...prevState,
      [chore]: prevState[chore] === 'Will' ? 'Kristyn' : (prevState[chore] === 'Kristyn' ? null : 'Will'),
    }));
  };

const handleMonthlyChoreClick = (chore) => {
  const currentDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  setCompletedMonthlyChores(prevState => {
    const prevCompletedBy = prevState[chore]?.completedBy;
    const completedBy = prevCompletedBy === 'Will' ? 'Kristyn' : (prevCompletedBy === 'Kristyn' ? null : 'Will');
    const completedDate = completedBy ? currentDate : prevState[chore]?.completedDate;
    return {
      ...prevState,
      [chore]: {
        completedBy,
        completedDate,
      },
    };
  });
};

  return (
    <div>
      <h2>Daily Chores</h2>
      <table>
        <thead>
          <tr>
            <th>Chore</th>
            {daysOfWeek.map(day => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {['Dishes', 'Sweep', 'Garbage', 'Laundry', 'Feed Cats'].map(chore => (
            <tr key={chore}>
              <td>{chore}</td>
              {daysOfWeek.map(day => (
                <td
                  key={`${day}-${chore}`}
                  onClick={() => handleDailyChoreClick(day, chore)}
                  style={{
                    backgroundColor: completedDailyChores[day]?.[chore] === 'Will' ? 'green' : (completedDailyChores[day]?.[chore] === 'Kristyn' ? 'pink' : 'white'),
                    cursor: 'pointer',
                    color: 'black',
                    textAlign: 'center',
                  }}
                >
                  {completedDailyChores[day]?.[chore] === 'Will' && 'W'}
                  {completedDailyChores[day]?.[chore] === 'Kristyn' && 'K'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Weekly Chores</h2>
      <table>
        <thead>
          <tr>
            <th>Chore</th>
            <th>Completed</th>
          </tr>
        </thead>
        <tbody>
          {weeklyChores.map(chore => (
            <tr key={chore}>
              <td>{chore}</td>
              <td
                onClick={() => handleWeeklyChoreClick(chore)}
                style={{
                  backgroundColor: completedWeeklyChores[chore] === 'Will' ? 'green' : (completedWeeklyChores[chore] === 'Kristyn' ? 'pink' : 'white'),
                  cursor: 'pointer',
                  color: 'black',
                  textAlign: 'center',
                }}
              >
                {completedWeeklyChores[chore] === 'Will' && 'W'}
                {completedWeeklyChores[chore] === 'Kristyn' && 'K'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Monthly Chores</h2>
      <table>
        <thead>
          <tr>
            <th>Chore</th>
            <th>Completed By</th>
            <th>Completed Date</th>
          </tr>
        </thead>
        <tbody>
          {monthlyChores.map(chore => (
            <tr key={chore}>
              <td>{chore}</td>
              <td
                onClick={() => handleMonthlyChoreClick(chore)}
                style={{
                  backgroundColor: completedMonthlyChores[chore]?.completedBy === 'Will' ? 'green' : (completedMonthlyChores[chore]?.completedBy === 'Kristyn' ? 'pink' : 'white'),
                  cursor: 'pointer',
                  color: 'black',
                  textAlign: 'center',
                }}
              >
                {completedMonthlyChores[chore]?.completedBy === 'Will' && 'W'}
                {completedMonthlyChores[chore]?.completedBy === 'Kristyn' && 'K'}
              </td>
              <td>{completedMonthlyChores[chore]?.completedDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ChoreTable;