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

  const [lastWeeksScores, setLastWeeksScores] = useState({ Will: 0, Kristyn: 0 });
  const [allTimeHighScores, setAllTimeHighScores] = useState({ Will: 0, Kristyn: 0 });

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
      {console.log("Return being rendered.")}
      <h2>Daily Chores</h2>
      {/* Table for daily chores */}
      <table>
        <thead>
          <tr>
            <th></th>
            {/* Table headers for each day of the week */}
            {daysOfWeek.map(day => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Rows for each daily chore */}
          {/* Each row contains cells for each day of the week */}
        </tbody>
      </table>

      <h2>Weekly Chores</h2>
      {/* Table for weekly chores */}
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Completed</th>
          </tr>
        </thead>
        <tbody>
          {/* Rows for each weekly chore */}
          {/* Each row contains a cell to display completion status */}
        </tbody>
      </table>

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
          {/* Rows for each monthly chore */}
          {/* Each row contains cells for completion status and date */}
        </tbody>
      </table>

      <button onClick={calculateScores}>New Week</button>
      {/* Display last week's scores */}
      <p>Last Week's Score: Will - {lastWeeksScores.Will}, Kristyn - {lastWeeksScores.Kristyn}</p>
      {/* Display all-time high scores */}
      <p>All-time HiScore: Will - {allTimeHighScores.Will}, Kristyn - {allTimeHighScores.Kristyn}</p>
    </div>
  );
}

export default ChoreTable;
