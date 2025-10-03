import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase';

/**
 * Custom hook for fetching user IDs from the Firestore `userScores` collection.
 *
 * This hook fetches all user documents and returns a list of document IDs
 * (which are the user names). It excludes the legacy "Kevin" user to keep
 * the UI focused on the active participants. If you wish to filter out
 * additional users in the future, adjust the `filter` condition accordingly.
 */
export const useFetchUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, 'userScores'));
      // Extract the document IDs and remove deprecated users
      const usersData = querySnapshot.docs
        .map(doc => doc.id)
        .filter(userId => userId.toLowerCase() !== 'kevin');
      setUsers(usersData);
    };

    fetchUsers();
  }, []);

  return users;
};