# ChoreTracker

ChoreTracker is a web application designed to help users efficiently manage and track their daily, weekly, and monthly chores. Built with React and Firebase, it offers a seamless experience for setting up chores and monitoring progress. With an added twist of scoring!

## Features

- **Task Management**: Easily add, update, and delete chores or users via the database.
- **Responsive Design**: Fully responsive layout for desktop and mobile devices.
- **Light/Dark Mode**: User-friendly interface with theme toggling.
- **Up-to-Date Data on Load**: Utilizes Firebase's robust cloud infrastructure to ensure the latest data is presented each time the page is loaded, offering a seamless and updated view of information reflective of any changes made by users.

## Demo
[Click here to try out the demo version.]()

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository:\
```git clone https://github.com/WillWSmith/ChoreTracker.git```

2. Navigate to the project directory:\
```cd ChoreTracker```

3. Install dependencies:\
```npm install```

4. Setup Database:\
To set up your Firestore Database using the exported db files found in the /misc/ folder of this project:\
 - Navigate to the [Firebase Console](https://console.firebase.google.com/), select your project, and go to the Firestore Database section.
- Follow the Firebase documentation for importing data to Firestore. Since Google's setup instructions may change over time, refer to the [official Firebase documentation](https://firebase.google.com/docs/firestore) for the most current methods.
- Reminder: There are multiple ways to import data into Firestore. If the provided method changes, please consult the Firebase documentation or other current resources for guidance.

If you are still experiencing issues setting up the database I have included the structure of the database [below](#firestore-database-structure)

5. Create and setup .env file in the root of your directory. Format:

```
REACT_APP_FIREBASE_API_KEY=[api-key]
REACT_APP_FIREBASE_AUTH_DOMAIN=[auth-domain]
REACT_APP_FIREBASE_PROJECT_ID=[project-id]
REACT_APP_FIREBASE_STORAGE_BUCKET=[storage-bucket]
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=[messaging-sender-id]
REACT_APP_FIREBASE_APP_ID=[app-id]
REACT_APP_FIREBASE_MEASUREMENT_ID=[measurement-id]
```
*Replace [] with values from your Firebase Project Settings*

6. Start the development server:\
```npm run start```

## Firestore Database Structure

To set up your Firestore Database, you will need to create the following collections and documents with the specified fields.

*Only do this if the export docs above did not work for you or if you prefer manual setup*

### Collections and Documents

#### `dailyChores`
Each document represents a chore to be done daily.
- DocumentID: `choreID1`, `choreID2`, ... (unique identifiers for each chore can be auto generated)
- Fields:
  - `name`: string - name of chore
  - `days`: map (each key is a day of the week with a map value)
    - `Monday`: 
      - `completedBy`: string - null
    - `Tuesday`: 
      - `completedBy`: string - null
    ... (repeat for all days of the week)

- *We use null as the default value. This will change when the chore is marked Completed by someone.*

#### `weeklyChores`
Each document represents a chore to be done weekly.
- DocumentID: `choreID0`, `choreID1`, ... (unique identifiers for each chore can be auto generated)
- Fields:
  - `name`: string - name of the chore
  - `completedBy`: string - null

 - *We use null as the default value. This will change when the chore is marked Completed by someone.* 

#### `monthlyChores`
Each document represents a chore to be done monthly.
- DocumentID: `choreID1`, `choreID2`, ... (unique identifiers for each chore can be auto generated)
- Fields:
  - `name`: string - name of the chore
  - `completedBy`: string - null
  - `completedDate`: timestamp (Put any date. Will be updated upon being marked as completed)

#### `userScores`
Each document represents the scores for a user.
- DocumentID: `Kevin`, `Kristyn`, `Will`, ... (user names as identifiers)\
 *Note These Identifiers Cannot Be Auto Generated Like The Rest*
- Fields:
  - `allTimeHighScores`: number - 0 (default)
  - `lastWeekScores`: number - 0 (default)

**Important Reminder:** Firestore's interface and functionality may change, so if these instructions do not match the latest Firestore console, please refer to the [official Firestore documentation](https://firebase.google.com/docs/firestore) for updated procedures.

For other database setup options and detailed instructions, consider exploring community tutorials and resources that are kept up-to-date with the latest Firebase updates.


## Built With

- [React](https://reactjs.org/) - The web framework used
- [Firebase](https://firebase.google.com/) - Database and Authentication

## Authors

- **Will Smith** - *Initial work* - [WillWSmith](https://github.com/WillWSmith)