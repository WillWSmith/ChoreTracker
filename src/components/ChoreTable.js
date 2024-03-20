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
  const [lastWeeksScores, setLastWeeksScores] = useState({ Will: 0, Kristyn: 0 });
  const [allTimeHighScores, setAllTimeHighScores] = useState({ Will: 0, Kristyn: 0 });

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
    setCompletedMonthlyChores(prevState => {
      const prevChore = prevState[chore] || {};
      const completedBy = prevChore.completedBy === 'Will' ? 'Kristyn' : (prevChore.completedBy === 'Kristyn' ? null : 'Will');
      const completedDate = completedBy ? prevChore.completedDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null;
  
      return {
        ...prevState,
        [chore]: {
          completedBy,
          completedDate
        }
      };
    });
  };

  const calculateScores = () => {
    let willScore = 0;
    let kristynScore = 0;
  
    // Calculate scores for daily chores
    daysOfWeek.forEach(day => {
      Object.values(completedDailyChores[day] || {}).forEach(chore => {
        if (chore === 'Will') willScore++;
        if (chore === 'Kristyn') kristynScore++;
      });
    });
  
    // Calculate scores for weekly chores
    weeklyChores.forEach(chore => {
      if (completedWeeklyChores[chore] === 'Will') willScore += 2;
      if (completedWeeklyChores[chore] === 'Kristyn') kristynScore += 2;
    });
  
    // Calculate scores for monthly chores completed in the last week
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    monthlyChores.forEach(chore => {
      if (completedMonthlyChores[chore]?.completedBy && new Date(completedMonthlyChores[chore].completedDate) > lastWeek) {
        if (completedMonthlyChores[chore].completedBy === 'Will') willScore += 3;
        if (completedMonthlyChores[chore].completedBy === 'Kristyn') kristynScore += 3;
      }
    });
  
    // Update last week's scores
    setLastWeeksScores({ Will: willScore, Kristyn: kristynScore });
  
    // Update all-time high scores
    setAllTimeHighScores(prevScores => ({
      Will: Math.max(willScore, prevScores.Will),
      Kristyn: Math.max(kristynScore, prevScores.Kristyn)
    }));
  };
  

  return (
    <div>
      <h2>Daily Chores</h2>
      {/* Table for daily chores */}
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
          {['Dishes', 'Sweep', 'Garbage', 'Laundry', 'Feed Cats', 'Toys'].map(chore => (
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
      {/* Table for weekly chores */}
      <div className="weekly-chore-container">
  <table>
    <thead>
      <tr>
        <th></th>
        <th>Completed</th>
      </tr>
    </thead>
    <tbody>
      {/* First half of the weekly chores */}
      {weeklyChores.slice(0, Math.ceil(weeklyChores.length / 2)).map(chore => (
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

  <table>
    <thead>
      <tr>
        <th></th>
        <th>Completed</th>
      </tr>
    </thead>
    <tbody>
      {/* Second half of the weekly chores */}
      {weeklyChores.slice(Math.ceil(weeklyChores.length / 2)).map(chore => (
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
</div>

      <h2>Monthly Chores</h2>
      {/* Table for monthly chores */}
      <table>
        <thead>
          <tr>
            <th></th>
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

      <button className="button" onClick={calculateScores}>New Week</button>
      {/* Display last week's scores */}
      <p>Last Week's Score: Will - {lastWeeksScores.Will}, Kristyn - {lastWeeksScores.Kristyn}</p>
      {/* Display all-time high scores */}
      <p>All-time HiScore: Will - {allTimeHighScores.Will}, Kristyn - {allTimeHighScores.Kristyn}</p>
    </div>
  );
}

export default ChoreTable;